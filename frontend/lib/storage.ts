import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const client = createClient(supabaseUrl, supabaseKey);

export async function uploadAttachment(file: File): Promise<string> {
  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await client.storage.from('attachments').upload(filePath, file);
  if (error) throw error;
  const { data } = client.storage.from('attachments').getPublicUrl(filePath);
  return data.publicUrl;
}
