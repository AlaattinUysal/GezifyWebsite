import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqronanpwluzofvxnmmr.supabase.co';
const supabaseKey = 'sb_publishable_ZrnMso30KIVHtuUuiXMufA_0-NF28TC'; // Public anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
