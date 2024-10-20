require('dotenv').config();
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
import * as path from 'path';

console.log(supabaseUrl);
console.log(supabaseAnonKey);


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}
const supabase=createClient(supabaseUrl,supabaseAnonKey)
const bucketName=process.env.BUCKET_NAME || ""

export const fetchSupabaseFolder = async (folderPath: string, localPath: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
      limit: 100,
    });

    if (error) {
      throw error;
    }

    if (data) {
      await Promise.all(data.map(async (fileOrFolder:any) => {
        const itemPath = `${folderPath}/${fileOrFolder.name}`;

        if (fileOrFolder.metadata) {
          const { data: fileData, error: downloadError } = await supabase
            .storage
            .from(bucketName)
            .download(itemPath);

          if (downloadError) {
            throw downloadError;
          }

          if (fileData) {
            const localFilePath = path.join(localPath, fileOrFolder.name);

            const dirPath = path.dirname(localFilePath);
            fs.mkdir(dirPath,{recursive:true},()=>{})

             const buffer = await fileData.arrayBuffer();
             const bufferData = Buffer.from(buffer);
             fs.writeFile(localFilePath, bufferData,()=>{});

            console.log(`Downloaded ${itemPath} to ${localFilePath}`);
          }
        } else {
          // If item is a folder, recursively fetch its contents
          const newLocalPath = path.join(localPath, fileOrFolder.name);
          await fetchSupabaseFolder(itemPath, newLocalPath);
        }
      }));
    }
  } catch (error) {
    console.error("Error fetching folder from Supabase:", error);
  }
};

function createFolder(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) {
            fs.mkdir(dir, { recursive: true }, (err) => {
                if (err) reject(err);
                else resolve();
            });
        } else {
            resolve();
        }
    });
}


export async function copySupabaseFolder( sourcePrefix: string, destinationBucket: string, destinationPrefix: string): Promise<void> {
    try {
        const { data: listData, error: listError } = await supabase
            .storage
            .from(bucketName)
            .list(sourcePrefix);

        if (listError) {
            console.error('Error listing objects:', listError);
            return;
        }

        if (listData && listData.length > 0) {
            for (const object of listData) {
                const filePath = `${sourcePrefix}/${object.name}`;
                const { data: fileData, error: fileError } = await supabase
                    .storage
                    .from(bucketName)
                    .download(filePath);

                if (fileError) {
                    console.error(`Error downloading ${filePath}:`, fileError);
                    continue;
                }

                if (fileData) {
                    const buffer = await fileData.arrayBuffer();
                    const { error: uploadError } = await supabase
                        .storage
                        .from(destinationBucket)
                        .upload(`${destinationPrefix}/${object.name}`, Buffer.from(buffer));

                    if (uploadError) {
                        console.error(`Error uploading ${object.name} to ${destinationBucket}:`, uploadError);
                    } else {
                        console.log(`Copied ${filePath} to ${destinationPrefix}/${object.name}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error copying folder:', error);
    }
}

export const saveToSupabase = async ( key: string, content: string): Promise<void> => {
    const { error } = await supabase
        .storage
        .from(bucketName)
        .upload(key, Buffer.from(content));

    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log(`File saved to ${bucketName}/${key}`);
    }
}
