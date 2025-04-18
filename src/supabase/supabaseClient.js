// src/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://liglezjwuzedcunizxyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZ2xlemp3dXplZGN1bml6eHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MTczMjAsImV4cCI6MjA2MDI5MzMyMH0.9ycGB875lLv1p-jcVTvwKQycaC3LJF9pObQeKvRTwEc';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export default supabase;
