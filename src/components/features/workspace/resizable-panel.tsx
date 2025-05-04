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
        borderRight: '1px solid #e5e7eb',
        width: isCollapsed ? 0 : width
      };
    } else {
      return {
        right: 0,
        borderLeft: '1px solid #e5e7eb',
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
  
  return (
    <div className="relative h-full">
      {/* 折叠时的展开按钮 - 始终位于外部，确保可见性 */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="absolute p-2 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 z-20"
          style={{ 
            top: '50%', 
            transform: 'translateY(-50%)',
            [position === 'left' ? 'left' : 'right']: 0
          }}
          aria-label={`Expand ${position} panel`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={position === 'left' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} 
            />
          </svg>
        </button>
      )}
      
      <div 
        className={`h-full bg-white dark:bg-gray-900 overflow-hidden transition-width duration-200 ease-in-out relative`} 
        style={getPositionStyles()}
      >
        {!isCollapsed && (
          <div 
            className="absolute top-0 right-0 p-2"
            style={{ [position === 'left' ? 'right' : 'left']: 0 }}
          >
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={`Collapse ${position} panel`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={position === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
                />
              </svg>
            </button>
          </div>
        )}
        
        {!isCollapsed && (
          <div 
            style={getResizeHandleStyles()}
            onMouseDown={handleResizeMouseDown}
            className="hover:bg-blue-400"
          />
        )}
        
        <div className="h-full overflow-y-auto">
          {!isCollapsed && children}
        </div>
      </div>
    </div>
  );
};

export default ResizablePanel; 