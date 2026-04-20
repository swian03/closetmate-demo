import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseEnabled ? createClient(supabaseUrl as string, supabaseAnonKey as string) : null;

export const uploadImageIfNeeded = async (uri?: string) => {
  if (!uri) return undefined;
  if (!isSupabaseEnabled || !supabase) return uri;
  if (uri.startsWith('http')) return uri;

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  const fileName = `clothing-${Date.now()}.jpg`;
  const { data, error } = await supabase.storage.from('clothing-images').upload(fileName, arrayBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) {
    console.warn('Supabase image upload failed:', error.message);
    return uri;
  }

  const publicUrl = supabase.storage.from('clothing-images').getPublicUrl(data.path).data.publicUrl;
  return publicUrl || uri;
};
