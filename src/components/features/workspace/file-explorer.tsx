import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../../../lib/language-context';

// 定义文件类型枚举
type FileType = 'file' | 'folder';

// 定义文件系统项接口
interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: FileSystemItem[];
  parentId?: string;
  isExpanded?: boolean;
  icon?: string; // 用于显示文件类型图标
}

// 定义组件接口
interface FileExplorerProps {
  openFiles: string[];
  currentFile: string;
  fileContents: { [key: string]: string };
  onFileClick: (fileName: string) => void;
  onCreateFile: (fileName: string, parentPath?: string) => void;
  planTitle?: string | null; // 添加可选的planTitle属性
}

/**
 * 文件资源管理器组件
 * 
 * 用于显示和管理工作空间中的文件列表，支持创建新文件和选择文件
 */
const FileExplorer: React.FC<FileExplorerProps> = ({
  openFiles,
  currentFile,
  fileContents,
  onFileClick,
  onCreateFile,
  planTitle
}) => {
  const { language } = useLanguage();
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(() => {
    // 初始化文件系统，基于当前的openFiles
    const rootFiles: FileSystemItem[] = openFiles.map(fileName => ({
      id: fileName,
      name: fileName,
      type: 'file',
      content: fileContents[fileName] || ''
    }));
    
    return rootFiles;
  });
  
  // 跟踪展开的文件夹
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleCreateFile = (parentPath?: string) => {
    const fileName = prompt(language === 'zh' ? '请输入文件名:' : 'Enter file name:');
    if (fileName && !openFiles.includes(parentPath ? `${parentPath}/${fileName}` : fileName)) {
      const path = parentPath ? `${parentPath}/${fileName}` : fileName;
      onCreateFile(path);
      toast.success(language === 'zh' ? `文件 ${fileName} 已创建` : `File ${fileName} created`);
      
      // 更新本地文件系统状态
      const newFile: FileSystemItem = {
        id: path,
        name: fileName,
        type: 'file',
        content: '',
        parentId: parentPath
      };
      
      if (!parentPath) {
        // 添加到根目录
        setFileSystem(prev => [...prev, newFile]);
      } else {
        // 添加到指定文件夹
        setFileSystem(prev => {
          const updateChildren = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map(item => {
              if (item.id === parentPath) {
                return {
                  ...item,
                  children: [...(item.children || []), newFile],
                  isExpanded: true
                };
              } else if (item.children) {
                return {
                  ...item,
                  children: updateChildren(item.children)
                };
              }
              return item;
            });
          };
          
          return updateChildren(prev);
        });
        
        // 确保父文件夹展开
        setExpandedFolders(prev => {
          const updated = new Set(prev);
          updated.add(parentPath);
          return updated;
        });
      }
    } else if (fileName && openFiles.includes(parentPath ? `${parentPath}/${fileName}` : fileName)) {
      toast.error(language === 'zh' ? `文件 ${fileName} 已存在` : `File ${fileName} already exists`);
    }
  };

  const handleCreateFolder = (parentPath?: string) => {
    const folderName = prompt(language === 'zh' ? '请输入文件夹名:' : 'Enter folder name:');
    if (folderName) {
      const path = parentPath ? `${parentPath}/${folderName}` : folderName;
      
      // 更新本地文件系统状态
      const newFolder: FileSystemItem = {
        id: path,
        name: folderName,
        type: 'folder',
        children: [],
        parentId: parentPath,
        isExpanded: true
      };
      
      if (!parentPath) {
        // 添加到根目录
        setFileSystem(prev => [...prev, newFolder]);
      } else {
        // 添加到指定文件夹
        setFileSystem(prev => {
          const updateChildren = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map(item => {
              if (item.id === parentPath) {
                return {
                  ...item,
                  children: [...(item.children || []), newFolder],
                  isExpanded: true
                };
              } else if (item.children) {
                return {
                  ...item,
                  children: updateChildren(item.children)
                };
              }
              return item;
            });
          };
          
          return updateChildren(prev);
        });
      }
      
      // 确保父文件夹和新文件夹展开
      setExpandedFolders(prev => {
        const updated = new Set(prev);
        if (parentPath) updated.add(parentPath);
        updated.add(path);
        return updated;
      });
      
      toast.success(language === 'zh' ? `文件夹 ${folderName} 已创建` : `Folder ${folderName} created`);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const updated = new Set(prev);
      if (updated.has(folderId)) {
        updated.delete(folderId);
      } else {
        updated.add(folderId);
      }
      return updated;
    });
  };

  // 获取文件图标
  const getFileIcon = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    }
    
    // 根据文件扩展名返回不同图标
    const extension = item.name.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'js':
      case 'jsx':
        return (
          <span className="text-yellow-400 text-xs font-bold w-4 h-4 flex items-center justify-center">JS</span>
        );
      case 'ts':
      case 'tsx':
        return (
          <span className="text-blue-400 text-xs font-bold w-4 h-4 flex items-center justify-center">TS</span>
        );
      case 'json':
        return (
          <span className="text-yellow-200 text-xs font-bold w-4 h-4 flex items-center justify-center">{'{}'}</span>
        );
      case 'md':
        return (
          <span className="text-blue-200 text-xs font-bold w-4 h-4 flex items-center justify-center">MD</span>
        );
      case 'py':
        return (
          <span className="text-blue-400 text-xs font-bold w-4 h-4 flex items-center justify-center">PY</span>
        );
      case 'html':
        return (
          <span className="text-orange-400 text-xs font-bold w-4 h-4 flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </span>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  // 递归渲染文件系统项
  const renderFileSystemItem = (item: FileSystemItem, depth = 0) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(item.id);
    
    return (
      <div key={item.id} className="flex flex-col">
        <div 
          className={`
            flex items-center p-1 rounded-sm cursor-pointer 
            ${item.id === currentFile ? 'bg-gray-700 text-white' : 'hover:bg-gray-800 text-gray-300'}
          `}
          onClick={() => {
            if (isFolder) {
              toggleFolder(item.id);
            } else {
              onFileClick(item.id);
            }
          }}
          style={{ paddingLeft: `${(depth + 1) * 12}px` }}
        >
          {/* 折叠/展开箭头（仅文件夹） */}
          {isFolder && (
            <span className="w-4 h-4 flex items-center justify-center mr-1 text-gray-400">
              <svg 
                className={`w-3 h-3 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          {!isFolder && <span className="w-4 h-4 mr-1"></span>}
          
          {/* 文件/文件夹图标 */}
          <span className="mr-2 flex-shrink-0">
            {getFileIcon(item)}
          </span>
          
          {/* 文件/文件夹名称 */}
          <span className="truncate">{item.name}</span>
        </div>
        
        {/* 子文件/文件夹（如果是展开的文件夹） */}
        {isFolder && isExpanded && item.children && (
          <div className="flex flex-col">
            {item.children.map(child => renderFileSystemItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // 顶部项目名称（默认用任务卡片名称）和项目创建按钮
  const renderProjectHeader = () => {
    // 确保始终有一个默认值
    const projectName = planTitle || (language === 'zh' ? '项目文件' : 'Project Files');
    
    return (
      <div>
        {/* 顶部固定显示"资源管理器"标题 */}
        <div className="text-base font-medium text-white pb-2 mb-2 border-b-2 border-blue-500 inline-block">
          {language === 'zh' ? '资源管理器' : 'Explorer'}
        </div>
        
        {/* 项目名称行 */}
        <div className="flex items-center py-1.5 px-1 text-gray-300 hover:bg-gray-800 cursor-pointer rounded-sm mb-2">
          <span className="w-4 h-4 flex items-center justify-center mr-1 text-gray-400">
            <svg 
              className="w-3 h-3 transform rotate-90" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span className="font-semibold text-sm">{projectName}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-gray-900 text-gray-300 h-full">
      {/* 项目标题 */}
      {renderProjectHeader()}
      
      {/* 文件列表 */}
      <div className="mt-2 space-y-0.5">
        {fileSystem.map(item => renderFileSystemItem(item))}
      </div>
      
      {/* 底部操作栏 */}
      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
        <button
          onClick={() => handleCreateFile()}
          className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-sm bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {language === 'zh' ? '新建文件' : 'New File'}
        </button>
        
        <button
          onClick={() => handleCreateFolder()}
          className="flex-1 flex items-center justify-center gap-1 p-1.5 rounded-sm bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          {language === 'zh' ? '新建文件夹' : 'New Folder'}
        </button>
      </div>
    </div>
  );
};

export default FileExplorer; 