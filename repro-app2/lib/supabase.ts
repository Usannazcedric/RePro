import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etfsygfgkktxawffzxoe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZnN5Z2Zna2t0eGF3ZmZ6eG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzUxMTAsImV4cCI6MjA2NTMxMTExMH0.ZwasUMvUhp67ZTNBgbbcCtAvmNUavKZ2vaEX5ZRPoJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 