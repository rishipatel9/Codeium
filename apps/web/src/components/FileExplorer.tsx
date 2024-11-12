
import { useEffect, useState } from 'react';
import SignOut from '@/components/SignOut';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { supabaseClient } from '@/utils/SupabaseClient';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Button } from './ui/button';
// import { wsManager } from '@/utils/WebSocket';
// import TerminalComponent from '@/app/terminal/page';
import { getFileIcon }  from '@/utils/fileicons';
interface FileItem {
    name: string;
    isFolder: boolean;
  }
  
  // Create a utility function for icon mapping (create this in utils/fileIcons.ts)
  const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  });
  const FileExplorer = () => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [fileStructure, setFileStructure] = useState<FileItem[]>([]);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const params = useParams();
    const sessionId = params?.sessionId;
  
    const toggleFolder = async (path: string) => {
      setExpanded(prev => {
        const isExpanded = !prev[path];
        if (isExpanded) {
          fetchFileStructure(path);
        }
        return { ...prev, [path]: isExpanded };
      });
    };
  
    const fetchFileStructure = async (route: string = '/') => {
      try {
        setIsLoading(true);
        const res = await axios.post('/api/files', { sessionId, route });
        setCurrentFilePath(res.data.path);
        const newStructure: FileItem[] = res?.data?.files || [];
        // wsManager.sendMessage({ structure: newStructure, path: res.data.path });
        setFileStructure(newStructure);
      } catch (error) {
        console.error('Failed to fetch file structure:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchFileContent = async (path: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
          .download(path);
  
        if (error) throw error;
  
        if (data) {
          const textContent = await data.text();
          setFileContent(textContent);
          setCurrentFilePath(path);
          // setFileType(getFileType(path));
        }
      } catch (error) {
        console.error('Failed to fetch file:', error);
      } finally {
        setIsLoading(false);
      }
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
  
        if (error) throw error;
        console.log('File saved successfully');
      } catch (error) {
        console.error('Failed to save file:', error);
      }
    };
  
    useEffect(() => {
      if (sessionId) {
        fetchFileStructure();
      }
  
  
      // wsManager.init();
  
    }, [sessionId]);
  
    const renderTree = (structure: FileItem[], currentPath: string = '') => {
      return structure.map(item => {
        const fullPath = currentFilePath ? `${currentPath}/${item.name}` : item.name;
        const isFolder = item.isFolder;
        const isExpanded = expanded[fullPath];
  
        return (
          <div key={fullPath} className="ml-1">
            <div
              className="flex items-center cursor-pointer hover:bg-gray-900 p-1 rounded group text-gray-300"
              onClick={() => (isFolder ? toggleFolder(fullPath) : fetchFileContent(fullPath))}
            >
              {isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </>
              ) : (
                <div className="ml-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height={20} width={20}><path fill="#ffca28" d="M2 2h12v12H2V2m3.153 10.027c.267.567.794 1.033 1.694 1.033 1 0 1.686-.533 1.686-1.7V7.507H7.4v3.827c0 .573-.233.72-.6.72-.387 0-.547-.267-.727-.58l-.92.553m3.987-.12c.333.653 1.007 1.153 2.06 1.153 1.067 0 1.867-.553 1.867-1.573 0-.94-.54-1.36-1.5-1.773l-.28-.12c-.487-.207-.694-.347-.694-.68 0-.274.207-.487.54-.487.32 0 .534.14.727.487l.873-.58c-.366-.64-.886-.887-1.6-.887-1.006 0-1.653.64-1.653 1.487 0 .92.54 1.353 1.353 1.7l.28.12c.52.226.827.366.827.753 0 .32-.3.553-.767.553-.553 0-.873-.286-1.113-.686z"/></svg>
                   <img  
                      // src={`./${getFileIcon(item.name)}`} className="file-icon" alt={''}             />
                      src={`./${getFileIcon(item.name)}`} className="file-icon" alt={''}             /> 
                </div>
              )}
              <span className="ml-2 text-sm group-hover:text-blue-600">
                {item.name}
              </span>
            </div>
            {isFolder && isExpanded && renderTree(structure, fullPath)}
          </div>
        );
      });
    };
  
    return (
      <div className="bg-[#24252B]  border rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 min-h-[calc(100vh-200px)]">
          <div className="col-span-3 border-r">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Files</h2>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-280px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                </div>
              ) : (
                renderTree(fileStructure)
              )}
            </div>
          </div>
          <div className="col-span-9">
            {fileContent !== null ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 truncate">
                    {currentFilePath}
                  </h3>
                  <Button
                    onClick={saveFile}
                    size="sm"
                    className="ml-4"
                  >
                    Save
                  </Button>
                </div>
                <div className="flex-1 p-4">
                  <MonacoEditor
                    height="100%"
                    language={fileType || 'plaintext'}
                    value={fileContent}
                    onChange={(newValue: any) => setFileContent(newValue || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      rulers: [80],
                      wordWrap: 'on',
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to edit
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  