import React, { useRef, useState, useEffect } from 'react';

// 定义组件接口
interface ResizablePanelProps {
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  position: 'left' | 'right';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  children: React.ReactNode;
}

/**
 * 可调整大小的面板组件
 * 
 * 可以通过拖动边缘调整宽度，支持折叠/展开功能
 */
const ResizablePanel: React.FC<ResizablePanelProps> = ({
  initialWidth,
  minWidth = 200,
  maxWidth = 600,
  position,
  isCollapsed,
  onToggleCollapse,
  children
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef<{ startX: number; startWidth: number } | null>(null);
  
  // 处理鼠标按下开始调整大小
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizingRef.current = {
      startX: e.clientX,
      startWidth: width
    };
  };
  
  // 处理调整大小过程中的鼠标移动
  useEffect(() => {
    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizingRef.current) return;
      
      const delta = position === 'left' 
        ? e.clientX - resizingRef.current.startX 
        : resizingRef.current.startX - e.clientX;
      
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, resizingRef.current.startWidth + delta)
      );
      
      setWidth(newWidth);
    };
    
    const handleResizeMouseUp = () => {
      setIsResizing(false);
      resizingRef.current = null;
    };
    
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleResizeMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, position]);
  
  const getPositionStyles = () => {
    if (position === 'left') {
      return {
        left: 0,
        borderRight: '1px solid #333',
        width: isCollapsed ? 0 : width
      };
    } else {
      return {
        right: 0,
        borderLeft: '1px solid #333',
        width: isCollapsed ? 0 : width
      };
    }
  };
  
  const getResizeHandleStyles = () => {
    return {
      position: 'absolute',
      top: 0,
      [position === 'left' ? 'right' : 'left']: -3,
      width: 6,
      height: '100%',
      cursor: 'col-resize',
      zIndex: 10
    } as React.CSSProperties;
  };

  // 控制图标
  const IconAdd = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconHistory = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconMenu = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconClose = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconExpand = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d={position === 'left' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  
  return (
    <div className="relative h-full">
      {/* 折叠时的最小化侧栏 */}
      {isCollapsed && (
        <div className="absolute h-full bg-gray-800 border-r border-gray-700" style={{ 
          width: '28px',
          [position === 'left' ? 'left' : 'right']: 0
        }}>
          {/* 控制按钮垂直排列 */}
          <div className="flex flex-col items-center justify-between h-full py-2">
            {/* 顶部按钮组 */}
            <div className="flex flex-col items-center gap-2">
              <button
                className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                aria-label="新建"
              >
                <IconAdd />
              </button>
              <button
                className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                aria-label="历史记录"
              >
                <IconHistory />
              </button>
              <button
                className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                aria-label="菜单"
              >
                <IconMenu />
              </button>
            </div>
            
            {/* 底部展开按钮 */}
            <button
              onClick={onToggleCollapse}
              className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
              aria-label={position === 'left' ? '展开左侧栏' : '展开右侧栏'}
            >
              <IconExpand />
            </button>
          </div>
        </div>
      )}
      
      <div 
        className={`h-full bg-gray-900 overflow-hidden transition-width duration-200 ease-in-out relative`}
        style={getPositionStyles()}
      >
        {!isCollapsed && (
          <>
            {/* 顶部控制栏 */}
            <div className="flex items-center justify-between h-10 px-2 bg-gray-800 border-b border-gray-700">
              {/* 标签区域 */}
              <div className="flex-1 flex items-center">
                <div className="py-1 px-3 text-gray-200 text-sm font-medium border-b-2 border-blue-500">
                  资源管理器
                </div>
              </div>
              
              {/* 控制按钮区域 */}
              <div className="flex items-center gap-1">
                <button
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                  aria-label="添加"
                >
                  <IconAdd />
                </button>
                <button
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                  aria-label="历史"
                >
                  <IconHistory />
                </button>
                <button
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                  aria-label="菜单"
                >
                  <IconMenu />
                </button>
                <button
                  onClick={onToggleCollapse}
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                  aria-label="关闭"
                >
                  <IconClose />
                </button>
              </div>
            </div>
            
            {/* 调整大小手柄 */}
            <div 
              style={getResizeHandleStyles()}
              onMouseDown={handleResizeMouseDown}
              className="hover:bg-blue-400"
            />
            
            {/* 内容区域 */}
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResizablePanel; 