require('dotenv').config();
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
import * as path from 'path';


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

    if (error) throw error;

    if (data) {
      await Promise.all(data.map(async (fileOrFolder: any) => {
        const itemPath = `${folderPath}/${fileOrFolder.name}`;

        if (fileOrFolder.metadata) { //
          const { data: fileData, error: downloadError } = await supabase
            .storage
            .from(bucketName)
            .download(itemPath);

          if (downloadError) throw downloadError;

          if (fileData) {
            const localFilePath = path.join(localPath, fileOrFolder.name);
            const dirPath = path.dirname(localFilePath);

            // Ensure the directory exists
            await fs.promises.mkdir(dirPath, { recursive: true });

            // Write file data to local path
            const buffer = await fileData.arrayBuffer();
            const bufferData = Buffer.from(buffer);
            await fs.promises.writeFile(localFilePath, bufferData);

            console.log(`Downloaded ${itemPath} to ${localFilePath}`);
          }
        } else { // Folder item
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


export async function generateFileTree(directory: string): Promise<any> {
  const tree = {};

  interface FileTree {
    [key: string]: FileTree | null;
  }

  async function buildTree(currentDir: string, currentTree: FileTree): Promise<void> {
    const files: string[] = await fs.promises.readdir(currentDir);
    
    // Process files in parallel using Promise.all
    await Promise.all(files.map(async (file) => {
      const filePath: string = path.join(currentDir, file);
      const stat: fs.Stats = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        currentTree[file] = {};
        await buildTree(filePath, currentTree[file] as FileTree);  
      } else {
        currentTree[file] = null;  // It's a file
      }
    }));
  }

  await buildTree(directory, tree);
  return tree;
}

export const checkIfFolderExists = async (folderPath: string): Promise<boolean> => {
  try {
    const stats = await fs.promises.stat(folderPath);
    return stats.isDirectory();  
  } catch (error:any) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      console.log("Error checking folder existence:", error);
      return false;
    }
  }
};