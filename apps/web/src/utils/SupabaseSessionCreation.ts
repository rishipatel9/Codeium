import { supabaseClient } from "./SupabaseClient";

// export async function getFileUrl(bucketName: string, filePath: string) {
//   const { data, error } = supabaseClient.storage
//     .from(bucketName)
//     .getPublicUrl(filePath);

//   if (error) {
//     console.error("Error getting public URL:", error.message);
//     return null;
//   }

//   return data.publicUrl;
// }
