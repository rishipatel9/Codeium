import { FilePlus, FolderPlus } from 'lucide-react';
import { Folder, File, TreeIndicator } from '../ui/file-tree';
import { Tree } from '../ui/file-tree';
import SkeletonLoader from '../SkeletonLoader';

type FileTreeProps = {
  fileTree: any;
  fetchFile: (filePath: string) => void;
  name: string;
  onCreateFile?: (filePath: string, name: string) => void;
  onCreateFolder?: (filePath: string, name: string) => void;
  onDeleteFileOrFolder?: (filePath: string) => void;
  onCloseAllFolders?: () => void;
};

const renderTree = (
  elements: any,
  fetchFile: (filePath: string) => void,
  parentPath: string = "",
  onCreateFile: FileTreeProps["onCreateFile"],
  onCreateFolder: FileTreeProps["onCreateFolder"],
  onDeleteFileOrFolder: FileTreeProps["onDeleteFileOrFolder"]
) => {
  return elements.map((element: any) => {
    const currentPath = `${parentPath}/${element.name}`;

    const handleCreateFile = () => {
      const fileName = prompt("Enter the name for the new file:");
      if (fileName && onCreateFile) {
        onCreateFile(currentPath, fileName);
      }
    };

    const handleCreateFolder = () => {
      const folderName = prompt("Enter the name for the new folder:");
      if (folderName && onCreateFolder) {
        onCreateFolder(currentPath, folderName);
      }
    };

    const handleDelete = () => {
      if (onDeleteFileOrFolder) {
        onDeleteFileOrFolder(currentPath);
      }
    };

    return element.isSelectable ? (
      <File
        key={element.id}
        value={element.id}
        isSelectable={true}
        onClick={() => fetchFile(currentPath)}
        className="hover:text-gray-500 w-full"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p onClick={() => fetchFile(currentPath)}>{element.name}</p>
        </div>
      </File>
    ) : (
      <Folder
        key={element.id}
        value={element.id}
        element={element.name}
        className="hover:text-gray-500 w-full"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* <p>{element.name}</p> */}
        </div>

        {element.children?.length > 0 && (
          <>
            <TreeIndicator />
            {renderTree(element.children, fetchFile, currentPath, onCreateFile, onCreateFolder, onDeleteFileOrFolder)}
          </>
        )}
      </Folder>
    );
  });
};

export function FileTree({
  fileTree,
  fetchFile,
  name,
  onCreateFile,
  onCreateFolder,
  onDeleteFileOrFolder,
  onCloseAllFolders,
}: FileTreeProps) {
  const convertFileTreeToElements = (fileTree: any | null): any[] => {
    if (!fileTree) return [];
    const folders = Object.keys(fileTree).filter((key) => fileTree[key] !== null);
    const files = Object.keys(fileTree).filter((key) => fileTree[key] === null);

    const sortedFolders = folders.map((folderName) => ({
      id: folderName,
      name: folderName,
      isSelectable: false,
      children: convertFileTreeToElements(fileTree[folderName]),
    }));

    const sortedFiles = files.map((fileName) => ({
      id: fileName,
      name: fileName,
      isSelectable: true,
      children: undefined,
    }));

    return [...sortedFolders, ...sortedFiles];
  };

  const handleCreateFile = () => {
    const fileName = prompt("Enter the name for the new file:");
    if (fileName && onCreateFile) {
      const filePath = "./";
      onCreateFile(filePath, fileName);
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Enter the name for the new folder:");
    if (folderName && onCreateFolder) {
      const folderPath = "./";
      onCreateFolder(folderPath, folderName);
    }
  };

  const handleDelete = (filePath: string) => {
    if (onDeleteFileOrFolder) {
      onDeleteFileOrFolder(filePath);
    }
  };

  return (
    <div className="file-tree">
      <div className="file-tree-header flex items-center justify-between pb-2">
        <h3 className='font-bold text-white'>{name}</h3>
        <div className="file-tree-actions flex justify-center gap-2">
          <button
            onClick={handleCreateFile}
            title="Create File"
            className="cursor:pointer border-none"
          >
            <FilePlus className='hover:bg-gray-700 transition-all rounded-sm' />
          </button>
          <button
            onClick={handleCreateFolder}
            title="Create Folder"
            className='cursor:pointer border-none pt-1'
          >
            <FolderPlus className='hover:bg-gray-700 transition-all rounded-sm' />
          </button>
          <button
            className='cursor:pointer border-none pt-1'
            onClick={onCloseAllFolders}
            title="Close All Folders"
          >
            <FolderPlus className='hover:bg-gray-700 transition-all rounded-sm' />
          </button>
        </div>
      </div>

      {fileTree ? (
        <Tree elements={convertFileTreeToElements(fileTree)}>
          {renderTree(
            convertFileTreeToElements(fileTree),
            fetchFile,
            "",
            onCreateFile,
            onCreateFolder,
            onDeleteFileOrFolder
          )}
        </Tree>
      ) : (
        <div className='h-full w-full'>
          <SkeletonLoader/>
        </div>
      )}
    </div>
  );
}
