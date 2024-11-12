import { LucideFileText, LucideFolder, LucideImage, LucideCode } from 'lucide-react';

interface FileIconProps {
  extension: string;
}

const FileIcon: React.FC<FileIconProps> = ({ extension }) => {
  switch (extension) {
    case 'txt':
      return <LucideFileText size={16} />;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return <LucideCode size={16} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return <LucideImage size={16} />;
    default:
      return <LucideFolder size={16} />;
  }
};

export default FileIcon;