import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment/hosting dashboard.'
  );
}

const makeDummy = () => {
  const dummy = () => {
    console.error("Supabase environment variables are missing. Database operations will fail.");
    return dummy;
  };
  return new Proxy(dummy, {
    get(target, prop) {
      if (prop === 'then') return undefined;
      return dummy;
    }
  });
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeDummy();

