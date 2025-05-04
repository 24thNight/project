import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/button';
import { toast } from 'sonner';

interface ProjectTreeProps {
  planTitle: string;
  progress: number; // 0-100
  tasksCompleted: number;
  totalTasks: number;
  onTaskComplete?: () => void; // 添加回调函数
}

const ProjectTree: React.FC<ProjectTreeProps> = ({
  planTitle,
  progress = 0,
  tasksCompleted = 0,
  totalTasks = 0,
  onTaskComplete
}) => {
  const [waterDrops, setWaterDrops] = useState<{id: number, x: number, y: number}[]>([]);
  const [lastWaterTime, setLastWaterTime] = useState(0);
  
  // 树的成长阶段 - 基于进度确定
  const getTreeStage = () => {
    if (progress < 20) return 1; // 种子/小苗
    if (progress < 40) return 2; // 小树
    if (progress < 60) return 3; // 中等大小的树
    if (progress < 80) return 4; // 较大的树
    return 5; // 完全成长的树
  };
  
  const treeStage = getTreeStage();
  
  // 树高度基于阶段
  const treeHeight = 100 + (treeStage - 1) * 60;
  
  // 叶子数量基于进度
  const leavesCount = Math.max(1, Math.floor((progress / 100) * 20));
  
  // 浇水功能
  const handleWater = () => {
    // 防止频繁点击
    const now = Date.now();
    if (now - lastWaterTime < 3000) {
      toast.error('请稍等片刻再浇水');
      return;
    }
    setLastWaterTime(now);
    
    // 创建水滴动画
    const newDrop = {
      id: Date.now(),
      x: 50 + (Math.random() * 30 - 15), // 水滴x坐标
      y: 50 // 水滴起始y坐标
    };
    
    setWaterDrops(prev => [...prev, newDrop]);
    
    // 播放水滴动画后移除
    setTimeout(() => {
      setWaterDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, 1500);
    
    // 通知父组件任务完成
    if (onTaskComplete) {
      onTaskComplete();
    } else {
      // 如果没有回调，显示提示
      toast.success('🌱 浇水成功！树成长了一点！', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };
  
  // 生成随机叶子位置
  const generateLeaves = (count: number) => {
    const leaves = [];
    for (let i = 0; i < count; i++) {
      const left = 40 + Math.random() * 20; // 百分比位置
      const top = 20 + Math.random() * 40; // 百分比位置
      const size = 10 + Math.random() * 15; // 像素大小
      const rotation = Math.random() * 360; // 随机旋转
      const delay = Math.random() * 0.5; // 动画延迟
      
      leaves.push(
        <motion.div
          key={i}
          className="absolute rounded-full bg-green-500"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            originX: '50%',
            originY: '50%'
          }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            rotate: rotation,
            opacity: 0.8 + Math.random() * 0.2 
          }}
          transition={{ 
            delay: delay,
            duration: 0.5,
            type: 'spring'
          }}
        />
      );
    }
    return leaves;
  };
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{planTitle}</h2>
        <div className="px-4 py-1.5 bg-white/50 rounded-full inline-block">
          <p className="text-gray-700">
            进度: {progress}% · 已完成 {tasksCompleted}/{totalTasks} 个任务
          </p>
        </div>
      </div>
      
      {/* 树的容器 */}
      <div className="relative w-full max-w-md h-[500px] mx-auto">
        {/* 地面 */}
        <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-full"></div>
        
        {/* 水滴动画 */}
        {waterDrops.map(drop => (
          <motion.div
            key={drop.id}
            className="absolute w-4 h-6 bg-blue-400 rounded-full opacity-80"
            style={{ left: `${drop.x}%`, top: `${drop.y}%` }}
            initial={{ y: 0, opacity: 0.8 }}
            animate={{ y: 350, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
          />
        ))}
        
        {/* 树干 */}
        <motion.div
          className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 w-[30px] bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-md"
          style={{ height: `${treeHeight}px` }}
          initial={{ height: 0 }}
          animate={{ height: `${treeHeight}px` }}
          transition={{ duration: 1.5, type: 'spring' }}
        >
          {/* 树枝 */}
          {treeStage >= 2 && (
            <>
              <motion.div 
                className="absolute top-[30%] left-0 w-[50px] h-[15px] bg-amber-600 -translate-x-[40px]"
                initial={{ width: 0 }}
                animate={{ width: '50px' }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
              <motion.div 
                className="absolute top-[50%] right-0 w-[60px] h-[15px] bg-amber-600 translate-x-[10px]"
                initial={{ width: 0 }}
                animate={{ width: '60px' }}
                transition={{ delay: 0.7, duration: 0.8 }}
              />
              
              {treeStage >= 3 && (
                <>
                  <motion.div 
                    className="absolute top-[15%] right-0 w-[40px] h-[15px] bg-amber-600 translate-x-[10px]"
                    initial={{ width: 0 }}
                    animate={{ width: '40px' }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  />
                  <motion.div 
                    className="absolute top-[70%] left-0 w-[45px] h-[15px] bg-amber-600 -translate-x-[35px]"
                    initial={{ width: 0 }}
                    animate={{ width: '45px' }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                  />
                </>
              )}
            </>
          )}
        </motion.div>
        
        {/* 树叶/树冠 */}
        <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px]">
          {treeStage >= 2 && generateLeaves(leavesCount)}
        </div>
        
        {/* 根据树的成长阶段显示不同的信息 */}
        <div className="absolute top-0 left-0 p-4 text-gray-700">
          <div className="font-semibold">成长阶段: {treeStage}/5</div>
          <div className="text-sm">
            {treeStage === 1 && '种子已种下，任务刚刚开始'}
            {treeStage === 2 && '小树已发芽，继续努力！'}
            {treeStage === 3 && '树苗正在茁壮成长中'}
            {treeStage === 4 && '树木已经很高了，马上就能结果'}
            {treeStage === 5 && '树木已经完全成长，任务即将完成!'}
          </div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-8 flex space-x-4">
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={handleWater}
          disabled={progress >= 100}
        >
          浇水 (完成一个任务)
        </Button>
        <Button 
          variant="outline" 
          className="border-green-600 text-green-600"
          onClick={() => {
            if (tasksCompleted < totalTasks) {
              toast.info('点击左侧"项目文件"查看任务清单');
            } else {
              toast.success('所有任务已完成！🎉');
            }
          }}
        >
          查看任务清单
        </Button>
      </div>
    </div>
  );
};

export default ProjectTree; 