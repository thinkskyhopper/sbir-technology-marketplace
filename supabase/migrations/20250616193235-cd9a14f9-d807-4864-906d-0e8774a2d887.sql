
-- First, let's create a temporary function to handle example listings
-- We'll use the first admin user if available, or create a system profile

-- Insert example listings using the first available user or a system approach
WITH example_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO public.sbir_listings (
  title,
  description,
  phase,
  agency,
  value,
  deadline,
  category,
  status,
  submitted_at,
  approved_at,
  user_id
) 
SELECT 
  title, description, phase, agency, value, deadline, category, status, submitted_at, approved_at,
  COALESCE((SELECT id FROM example_user), gen_random_uuid()) as user_id
FROM (VALUES 
  (
    'Advanced AI-Powered Cybersecurity System',
    'Development of next-generation cybersecurity platform using machine learning algorithms to detect and prevent advanced persistent threats in real-time. The system will integrate with existing defense infrastructure and provide automated response capabilities.',
    'Phase II'::sbir_phase,
    'Department of Defense',
    175000000::bigint, -- $1.75M in cents
    '2024-12-15'::date,
    'Cybersecurity',
    'Active'::listing_status,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '25 days'
  ),
  (
    'Quantum Communication Network Prototype',
    'Research and development of secure quantum communication protocols for military applications. Focus on creating unhackable communication channels using quantum entanglement principles.',
    'Phase I'::sbir_phase,
    'Air Force Research Laboratory',
    50000000::bigint, -- $500K in cents
    '2024-11-30'::date,
    'Quantum Technology',
    'Active'::listing_status,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '15 days'
  ),
  (
    'Autonomous Drone Surveillance System',
    'Development of AI-powered autonomous drone fleet for border security and surveillance operations. Includes advanced computer vision, object recognition, and real-time threat assessment capabilities.',
    'Phase II'::sbir_phase,
    'Department of Homeland Security',
    220000000::bigint, -- $2.2M in cents
    '2025-01-20'::date,
    'Autonomous Systems',
    'Active'::listing_status,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Next-Gen Satellite Communication Array',
    'Design and prototype development of advanced satellite communication systems for secure military communications in contested environments. Features anti-jamming capabilities and self-healing network topology.',
    'Phase I'::sbir_phase,
    'Space Force',
    75000000::bigint, -- $750K in cents
    '2024-12-01'::date,
    'Space Technology',
    'Active'::listing_status,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Biomedical Sensor Network for Field Operations',
    'Development of wearable biomedical sensors for real-time health monitoring of military personnel in field operations. Includes vital signs monitoring, injury detection, and medical emergency alerts.',
    'Phase I'::sbir_phase,
    'Defense Health Agency',
    45000000::bigint, -- $450K in cents
    '2024-11-25'::date,
    'Biomedical Technology',
    'Active'::listing_status,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'Advanced Materials for Hypersonic Vehicles',
    'Research into ultra-high temperature resistant materials for next-generation hypersonic vehicle applications. Focus on ceramic matrix composites and thermal barrier coatings.',
    'Phase II'::sbir_phase,
    'Defense Advanced Research Projects Agency',
    320000000::bigint, -- $3.2M in cents
    '2025-02-10'::date,
    'Advanced Materials',
    'Active'::listing_status,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  )
) AS example_data(title, description, phase, agency, value, deadline, category, status, submitted_at, approved_at);
