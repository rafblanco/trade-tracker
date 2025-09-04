import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

let client: any = null;

// Only create client if we have real credentials
if (
  supabaseUrl !== "https://placeholder.supabase.co" &&
  supabaseKey !== "placeholder-key"
) {
  client = createClient(supabaseUrl, supabaseKey);
}

export async function uploadAttachment(file: File): Promise<string> {
  if (!client) {
    throw new Error(
      "Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  const filePath = `${Date.now()}_${file.name}`;
  const { error } = await client.storage
    .from("attachments")
    .upload(filePath, file);
  if (error) throw error;
  const { data } = client.storage.from("attachments").getPublicUrl(filePath);
  return data.publicUrl;
}
