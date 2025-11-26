import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MAGIC_BYTES = {
  jpg: [0xFF, 0xD8, 0xFF],
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  gif: [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF at start, WEBP at byte 8
};

function validateMagicBytes(bytes: Uint8Array, extension: string): boolean {
  const signatures = MAGIC_BYTES[extension.toLowerCase() as keyof typeof MAGIC_BYTES];
  if (!signatures) return false;

  // Special handling for WebP
  if (extension.toLowerCase() === 'webp') {
    // Check RIFF header
    if (bytes[0] !== 0x52 || bytes[1] !== 0x49 || bytes[2] !== 0x46 || bytes[3] !== 0x46) {
      return false;
    }
    // Check WEBP signature at bytes 8-11
    return bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }

  // Check if first bytes match the signature
  for (let i = 0; i < signatures.length; i++) {
    if (bytes[i] !== signatures[i]) {
      return false;
    }
  }
  
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string;
    const filePath = formData.get('filePath') as string;

    if (!file || !bucket || !filePath) {
      console.error('Missing required fields:', { hasFile: !!file, bucket, filePath });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, bucket, filePath' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      console.error('Invalid extension:', extension);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Validate MIME type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid MIME type:', file.type);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Must be an image.' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    if (!validateMagicBytes(bytes, extension)) {
      console.error('Invalid magic bytes for extension:', extension);
      return new Response(
        JSON.stringify({ error: 'File content does not match its extension' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File validation passed:', { 
      name: file.name, 
      size: file.size, 
      type: file.type, 
      extension,
      bucket,
      filePath 
    });

    // 5. Upload to Supabase storage with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '0'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Upload successful:', publicUrl);

    return new Response(
      JSON.stringify({ publicUrl }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-and-upload-image:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
