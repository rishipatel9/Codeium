'use client';
import { useEffect, useState } from 'react';
import SignOut from '@/components/SignOut';
import { useParams } from 'next/navigation';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { supabaseClient } from '@/utils/SupabaseClient';
import dynamic from 'next/dynamic';
import axios from 'axios';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface FileStructure {
  [key: string]: FileStructure | null;
}

const FileExplorer = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fileStructure, setFileStructure] = useState<FileStructure>({});
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const params = useParams();
  const sessionId = params?.sessionId;

  const toggleFolder = async (path: string) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    if (!expanded[path]) {
      await fetchFileStructure(path);
    }
  };

  const fetchFileStructure = async (route:string='/') => {
    try {
      const res = await axios.post('/api/files', { sessionId ,route});
      console.log('API Response:', res.data); 
      const path=res.data.files;
      
      const newStructure: FileStructure = res?.data?.files;

      for (const item of res.data || []) {
        if (item.isFolder) {
          newStructure[item.name] = item.children ? item.children : {}; 
        } else {
          newStructure[item.name] = null; 
        }
      }
      console.log(newStructure);
      
      setFileStructure((prev) => ({
        ...prev,
        [path]: newStructure, 
      }));
      console.log('Updated File Structure:', newStructure); // Log the updated structure
    } catch (error) {
      console.error('Failed to fetch file structure:', error);
    }
  };

  const fetchFileContent = async (path: string) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
        .download(path);

      if (error) {
        console.error('Error downloading file:', error);
        return;
      }

      if (data) {
        const textContent = await data.text();
        setFileContent(textContent);
        setCurrentFilePath(path);
        setFileType(getFileType(path));
      }
    } catch (error) {
      console.error('Failed to fetch file:', error);
    }
  };

  const getFileType = (path: string) => {
    const extension = path.split('.').pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      js: 'javascript',
      ts: 'typescript',
      json: 'json',
      css: 'css',
      html: 'html',
    };
    return typeMap[extension || ''] || 'plaintext';
  };

  const saveFile = async () => {
    if (!currentFilePath || !fileContent) return;

    try {
      const { error } = await supabaseClient.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
        .update(currentFilePath, fileContent, {
          cacheControl: '3600',
          upsert: true,
        });

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
    fetchFileStructure();
  }, []);

  const renderTree = (structure: FileStructure, currentPath: string = '') => {
    return Object.entries(structure).map(([name, value]) => {
      const fullPath = currentPath ? `${currentPath}/${name}` : name;
      const isFolder = value !== null;
      const isExpanded = expanded[fullPath];

      return (
        <div key={fullPath} className="ml-4">
          <div
            className="flex items-center cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => (isFolder ? toggleFolder(fullPath) : fetchFileContent(fullPath))}
          >
            {isFolder && (isExpanded ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />)}
            {isFolder ? (
              <Folder className="w-4 h-4 mr-1 text-yellow-500" />
            ) : (
              <File className="w-4 h-4 mr-1 text-gray-500" />
            )}
            <span>{name}</span>
          </div>
          {isFolder && isExpanded && value && renderTree(value, fullPath)} {/* Recursively render children */}
        </div>
      );
    });
  };

  return (
    <div className="bg-white border rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">File Explorer</h2>
      <div className="flex">
        <div className="w-1/3 pr-4 overflow-auto">
          {renderTree(fileStructure)}
        </div>
        <div className="w-2/3">
          {fileContent !== null ? (
            <div>
              <h3 className="text-lg font-bold mb-2">Editing: {currentFilePath}</h3>
              <MonacoEditor
                height="600px"
                language={fileType || 'plaintext'}
                value={fileContent}
                onChange={(newValue) => setFileContent(newValue || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                }}
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={saveFile}
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

export default function SessionIdPage() {
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
}
