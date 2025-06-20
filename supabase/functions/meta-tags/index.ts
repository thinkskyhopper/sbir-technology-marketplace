
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleRequest } from './requestHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleRequest(req, corsHeaders);
  } catch (error) {
    console.error('Error in meta-tags function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
});
