import { generateManifest } from 'material-icon-theme';
import { Manifest } from 'material-icon-theme';


// Generate the manifest
const manifest: Manifest = generateManifest(); // Generates the manifest // Log the entire manifest for debugging

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // First, check for specific file name associations
  if (manifest.iconDefinitions) {
      if( manifest.iconDefinitions[extension]){
        console.log(manifest.iconDefinitions[extension].iconPath)
        return manifest.iconDefinitions[extension].iconPath; 
    }
  }

  // Then check for specific file extension associations
  if (manifest.fileExtensions && manifest.fileExtensions[extension]) {
    console.log(manifest.fileExtensions[extension])
    return manifest.fileExtensions[extension];
  }

  // If nothing is found, return a default icon
  return '/icons/java.svg'; // Replace with your default icon path
};
