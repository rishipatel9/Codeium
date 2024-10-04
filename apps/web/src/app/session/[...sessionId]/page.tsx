'use client';
import { useEffect, useState } from 'react';
import SignOut from '@/components/SignOut';
import { useParams } from 'next/navigation';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { supabaseClient } from '@/utils/SupabaseClient';
import dynamic from 'next/dynamic';

// Dynamically import Monaco editor to avoid server-side rendering issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>, // Fallback while Monaco Editor loads
});

const FileExplorer = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fileStructure, setFileStructure] = useState<Record<string, any> | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null); // Track file type for Monaco language

  // Toggle folder open/close and fetch structure if needed
  const toggleFolder = (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    if (!expanded[path]) {
      fetchFileStructure(path);
    }
  };

  // Fetch file structure from Supabase
  const fetchFileStructure = async (path: string = 'react') => {
    try {
      console.log(`Fetching file structure for path: ${path}`);
      const { data, error } = await supabaseClient.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
        .list(path, { limit: 100, offset: 0 });

      if (error) {
        console.error('Error fetching file structure:', error);
        return;
      }

      console.log('Fetched data:', data);

      const structuredData = data?.reduce((acc: any, file: any) => {
        console.log(`Processing file: ${file.name}`);
        const parts = file.name.split('/');
        let current = acc;
        parts.forEach((part: string, idx: number) => {
          if (idx === parts.length - 1) {
            current[part] = null; // It's a file
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
        return acc;
      }, {});

      console.log('Structured data:', structuredData);

      setFileStructure(prev => ({
        ...prev,
        [path]: structuredData,
      }));
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  // Fetch file content and file type from Supabase
  const fetchFileContent = async (path: string) => {
    try {
      console.log(`Fetching content for file: ${path}`);
      const { data, error } = await supabaseClient.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
        .download(path);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      if (data) {
        const textContent = await data.text();
        console.log('File content:', textContent); // Debug log
        setFileContent(textContent);
        setCurrentFilePath(path);
        setFileType(getFileType(path)); // Determine file type
      } else {
        console.error('No file data returned');
      }
    } catch (error) {
      console.error('Failed to fetch file:', error);
    }
  };

  // Determine the file type for Monaco Editor's language setting
  const getFileType = (path: string) => {
    const extension = path.split('.').pop();
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default:
        return 'plaintext';
    }
  };

  // Save the edited file back to Supabase
  const saveFile = async (path: string, content: string) => {
    try {
      const { error } = await supabaseClient.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
        .update(path, content, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Error saving file:', error);
      } else {
        console.log('File saved successfully');
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  useEffect(() => {
    fetchFileStructure(); // Fetch root level initially
  }, []);

  // Render the file tree structure recursively
  const renderTree = (tree: Record<string, any> | null, path = '') => {
    if (!tree) return null;
    return Object.entries(tree).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFolder = typeof value === 'object' && value !== null;
      const isExpanded = expanded[currentPath as keyof typeof expanded] || false;

      console.log('Rendering:', { key, value, isFolder, currentPath, isExpanded });

      return (
        <div key={currentPath} className="ml-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => isFolder ? toggleFolder(currentPath) : fetchFileContent(currentPath)}
          >
            {isFolder ? (
              isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />
            ) : null}
            {isFolder ? <Folder className="w-4 h-4 mr-1 text-yellow-500" /> : <File className="w-4 h-4 mr-1 text-gray-500" />}
            <span>{key}</span>
          </div>
          {isFolder && isExpanded && renderTree(value, currentPath)}
        </div>
      );
    });
  };

  return (
    <div className="bg-white border rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">File Explorer</h2>
      <div className="flex">
        <div className="w-1/3 pr-4">
          {renderTree(fileStructure)}
        </div>
        <div className="w-2/3">
          {fileContent !== null ? (
            <div>
              <h3 className="text-lg font-bold mb-2">Editing File: {currentFilePath}</h3>
              <MonacoEditor
                height="600px"
                language={fileType || 'plaintext'} // Dynamically set language
                value={fileContent}
                onChange={(newValue) => setFileContent(newValue || '')}
                theme="vs-dark"
                options={{
                  readOnly: false,
                  minimap: { enabled: true },
                }}
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => currentFilePath && saveFile(currentFilePath, fileContent)}
              >
                Save File
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a file to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SessionIdPage = () => {
  const params = useParams();
  const sessionId = params?.sessionId;

  if (!sessionId) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session Details for {sessionId}</h1>
      <FileExplorer />
      <div className="mt-4">
        <SignOut />
      </div>
    </div>
  );
};

export default SessionIdPage;
