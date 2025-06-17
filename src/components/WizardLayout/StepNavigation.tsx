import React from 'react';
import { 
  CheckIcon, 
  ArrowRightIcon, 
  HistoryIcon, 
  BookTextIcon, 
  PlusSquareIcon,
  TargetIcon,
  SearchIcon,
  ActivityIcon,
  FileTextIcon,
  ClockIcon,
  TrendingUpIcon,
  ClipboardListIcon
} from 'lucide-react';
import { cn } from '@/utils/style';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  estimatedTime?: string;
}

interface StepNavigationProps {
  currentStep: string;
  onStepClick: (stepId: string) => void;
  progress: number;
  onHistoryClick?: () => void;
  onKnowledgeClick?: () => void;
  onNewResearchClick?: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onStepClick,
  progress,
  onHistoryClick,
  onKnowledgeClick,
  onNewResearchClick
}) => {
  const steps: Step[] = [
    {
      id: 'topic',
      title: '研究主题',
      description: '设定研究目标和范围',
      status: getStepStatus('topic', currentStep),
      estimatedTime: '2-5 分钟'
    },
    {
      id: 'feedback',
      title: '研究计划',
      description: '制定详细的研究计划',
      status: getStepStatus('feedback', currentStep),
      estimatedTime: '3-8 分钟'
    },
    {
      id: 'search',
      title: '信息收集',
      description: '搜索和整理相关资料',
      status: getStepStatus('search', currentStep),
      estimatedTime: '5-10 分钟'
    },
    {
      id: 'report',
      title: '撰写报告',
      description: '分析数据并生成最终报告',
      status: getStepStatus('report', currentStep),
      estimatedTime: '3-7 分钟'
    }
  ];

  function getStepStatus(stepId: string, current: string): 'completed' | 'active' | 'pending' {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(current);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  }

  function getStepIcon(stepId: string) {
    const iconMap = {
      'topic': TargetIcon,
      'feedback': ClipboardListIcon,
      'search': SearchIcon,
      'report': FileTextIcon
    };
    return iconMap[stepId as keyof typeof iconMap] || TargetIcon;
  }

  const completedSteps = steps.filter(step => step.status === 'completed').length;

  return (
    <aside className="w-64 bg-card/80 backdrop-blur-sm shadow-xl border-r border-border/40 flex flex-col relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-x-12" />

      {/* 标题和进度条 */}
      <div className="p-5 border-b border-border/40 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">LINGBRAIN 研究向导</h2>
          <div className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
            {completedSteps}/{steps.length}
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>研究进度</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 relative overflow-hidden">
          <div 
            className="h-2 bg-foreground rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 预计时间 */}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <ClockIcon className="w-3 h-3" />
          <span>总计：13-30 分钟预计</span>
        </div>
      </div>

      {/* 步骤列表 */}
      <nav className="p-3 flex-1 space-y-2 relative z-10">
        {steps.map((step, index) => {
          const StepIcon = getStepIcon(step.id);
          const isConnected = index < steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <div
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-accent/50",
                  step.status === 'completed' && "bg-accent/30 text-foreground",
                  step.status === 'active' && "bg-foreground/5 text-foreground border border-foreground/10",
                  step.status === 'pending' && "text-muted-foreground"
                )}
                onClick={() => onStepClick(step.id)}
              >

                
                {/* 步骤图标 */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10",
                  step.status === 'completed' && "bg-green-500 text-white shadow-lg shadow-green-500/25",
                  step.status === 'active' && "bg-foreground text-background scale-110 shadow-lg",
                  step.status === 'pending' && "bg-muted text-muted-foreground"
                )}>
                  {step.status === 'completed' ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : step.status === 'active' ? (
                    <StepIcon className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* 步骤信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium truncate">{step.title}</h3>
                    {step.status === 'active' && (
                      <TrendingUpIcon className="w-4 h-4 text-foreground animate-pulse" />
                    )}
                  </div>
                  <p className={cn(
                    "text-sm opacity-80 mb-1",
                    step.status === 'pending' && "opacity-60"
                  )}>
                    {step.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <ClockIcon className="w-3 h-3" />
                    <span>{step.estimatedTime}</span>
                  </div>
                </div>
              </div>
              
              {/* 连接线 */}
              {isConnected && (
                <div className="ml-9 my-1">
                  <div className={cn(
                    "w-0.5 h-4 transition-colors duration-300",
                    step.status === 'completed' ? "bg-green-500/40" : "bg-border/60"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 快速操作 */}
      <div className="p-3 border-t border-border/40 relative z-10">
        <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <span>快捷操作</span>
          <div className="flex-1 h-px bg-border/30" />
        </h4>
        <div className="space-y-2">
          <QuickActionButton 
            icon={HistoryIcon}
            label="研究历史" 
            description="查看过往研究"
            onClick={onHistoryClick || (() => {})} 
          />
          <QuickActionButton 
            icon={BookTextIcon}
            label="知识库" 
            description="浏览保存的资源"
            onClick={onKnowledgeClick || (() => {})} 
          />
          <QuickActionButton 
            icon={PlusSquareIcon}
            label="新建研究" 
            description="开始全新研究"
            onClick={onNewResearchClick || (() => {})} 
            variant="primary"
          />
        </div>
      </div>
    </aside>
  );
};

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick,
  variant = 'default'
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
        "hover:bg-accent/50 active:scale-95",
        variant === 'primary' && "bg-foreground/5 hover:bg-foreground/10 border border-foreground/10"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
        variant === 'primary' ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{label}</div>
        <div className="text-xs text-muted-foreground opacity-80 truncate">{description}</div>
      </div>
    </button>
  );
};

export default StepNavigation; 