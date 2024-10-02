import { supabaseClient } from "./SupabaseClient";

async function copyFolder(sourcePath: string, destinationPath: string, bucketName: string) {
  console.log(`Copying from ${sourcePath} to ${destinationPath}`);
  const { data: items, error: listError } = await supabaseClient.storage
    .from(bucketName)
    .list(sourcePath);

  if (listError) {
    console.error(`Error listing items in ${sourcePath}:`, listError);
    throw listError;
  }

  if (!items || items.length === 0) {
    console.log(`No items found in ${sourcePath}`);
    return;
  }
  for (const item of items) {
    const sourceItemPath = sourcePath ? `${sourcePath}/${item.name}` : item.name;
    const destItemPath = destinationPath ? `${destinationPath}/${item.name}` : item.name;
    if (item.metadata?.mimetype) {
      const { data: fileData, error: downloadError } = await supabaseClient.storage
        .from(bucketName)
        .download(sourceItemPath);

      if (downloadError) {
        console.error(`Error downloading ${sourceItemPath}:`, downloadError);
        continue;
      }

      if (fileData) {
        const { error: uploadError } = await supabaseClient.storage
          .from(bucketName)
          .upload(destItemPath, fileData, {
            contentType: item.metadata.mimetype,
            upsert: true
          });

        if (uploadError) {
          console.error(`Error uploading ${destItemPath}:`, uploadError);
        } else {
          console.log(`Successfully copied file: ${destItemPath}`);
        }
      }
    } else {
      await copyFolder(sourceItemPath, destItemPath, bucketName);
    }
  }
}

export async function fetchAndUploadTemplate(templatePath: string, destinationPath: string) {
  try {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("Bucket name is not defined in environment variables");
    }
    await copyFolder(templatePath, destinationPath, bucketName);
    console.log("Template copying completed");
  } catch (error) {
    console.error("Error in fetchAndUploadTemplate:", error);
    throw error;
  }
}
