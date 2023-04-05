/*
  Supabase configuration.
*/

// Supabase dependency is imported near end of index.html
const { createClient } = supabase;

// Get these values from the API section of your Supabase account
const supabaseUrl = 'https://pylqjswoerizijbqtnci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bHFqc3dvZXJpemlqYnF0bmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk0MjQxNTEsImV4cCI6MTk5NTAwMDE1MX0.78mDgMpj0YvDG0AxFYqRf8mVDTFroLN-mOnAXYdW0Fg';

// Note text case: Supabase != supabase
const Supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase Instance: ', Supabase);

// Export to allow import elsewhere
export  {
  Supabase
};