import React from 'react';
import { 
  SearchIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  TargetIcon,
  ActivityIcon,
  FileTextIcon,
  CheckCircleIcon,
  SparklesIcon,
  ClipboardListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/style';
import { useTaskStore } from '@/store/task';
import useDeepResearch from '@/hooks/useDeepResearch';

interface StepContentProps {
  currentStep: string;
  onPrevious: () => void;
  onNext: () => void;
  children: React.ReactNode;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  onPrevious,
  onNext,
  children,
  canGoNext = true,
  canGoPrevious = true
}) => {
  const taskStore = useTaskStore();
  const { status } = useDeepResearch();
  
  const stepInfo = getStepInfo(currentStep);

  function getStepInfo(step: string) {
    switch (step) {
      case 'topic':
        return {
          title: '研究主题',
          description: '定义您的研究目标和范围以开始研究',
          icon: TargetIcon,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          tips: [
            '明确您的研究问题',
            '定义清晰的目标和范围',
            '考虑您的目标受众'
          ]
        };
      case 'feedback':
        return {
          title: '研究计划',
          description: '制定详细的研究计划和执行方案',
          icon: ClipboardListIcon,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20',
          tips: [
            '制定研究方法和步骤',
            '确定信息收集渠道',
            '规划时间和资源分配'
          ]
        };
      case 'search':
        return {
          title: '信息收集',
          description: 'AI正在为您搜索和分析相关资料',
          icon: SearchIcon,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          tips: [
            'AI将搜索多个可靠来源',
            '信息将被自动过滤',
            '相关数据将按主题组织'
          ]
        };
      case 'report':
        return {
          title: '撰写报告',
          description: '智能分析数据并生成综合研究报告',
          icon: FileTextIcon,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          tips: [
            '使用AI算法分析数据',
            '提取关键见解和结论',
            '生成结构化的最终报告'
          ]
        };
      default:
        return {
          title: '研究主题',
          description: '定义您的研究目标和范围以开始研究',
          icon: TargetIcon,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          tips: []
        };
    }
  }

  const getStepNumber = (step: string) => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    return stepOrder.indexOf(step) + 1;
  };

  // 检查是否有正在处理的任务或AI生成过程
  const hasProcessingTasks = taskStore.tasks.some(task => task.state === 'processing');
  const hasProcessingResources = taskStore.resources.some(resource => resource.status === 'processing');
  const hasAIGenerationInProgress = status !== '';
  const isProcessingStep = hasProcessingTasks || hasProcessingResources || hasAIGenerationInProgress;

  return (
    <main className="flex-1 p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-primary/[0.02] rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* 面包屑导航 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>LINGBRAIN 研究向导</span>
            <ArrowRightIcon className="w-4 h-4" />
            <span>第 {getStepNumber(currentStep)} 步</span>
            <ArrowRightIcon className="w-4 h-4" />
            <span className={stepInfo.color}>{stepInfo.title}</span>
          </div>
        </div>

        {/* 简化的步骤标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border/40 bg-card/30">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              stepInfo.bgColor,
              "border",
              stepInfo.borderColor
            )}>
              <stepInfo.icon className={cn("w-5 h-5", stepInfo.color)} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-1">{stepInfo.title}</h2>
              <p className="text-sm text-muted-foreground">{stepInfo.description}</p>
            </div>
            
            {isProcessingStep && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm">
                <SparklesIcon className="w-4 h-4 animate-spin" />
                <span>处理中</span>
              </div>
            )}
          </div>
        </div>

        {/* 当前步骤内容 */}
        <div className="mb-6">
          <div className="bg-card/50 rounded-lg border border-border/40 p-4">
            {children}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            size="lg"
            className={cn(
              "flex items-center gap-2 px-6 py-3 h-auto",
              "bg-card/80 backdrop-blur-sm border-border/60",
              "hover:bg-card hover:border-border",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">上一步</div>
              <div className="text-xs text-muted-foreground">返回上一步骤</div>
            </div>
          </Button>
          
          <div className="flex items-center gap-4">
            {/* 步骤指示器 */}
            <div className="flex items-center gap-2">
              {['topic', 'feedback', 'search', 'report'].map((step, index) => {
                const isActive = step === currentStep;
                const stepOrder = ['topic', 'feedback', 'search', 'report'];
                const currentIndex = stepOrder.indexOf(currentStep);
                const stepIndex = stepOrder.indexOf(step);
                
                // 在最后一步时，所有步骤都显示为已完成
                const isCompleted = currentStep === 'report' ? true : stepIndex < currentIndex;
                const isCurrentAndLast = isActive && currentStep === 'report';
                
                return (
                  <div
                    key={step}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      (isCompleted || isCurrentAndLast) && "bg-green-500 scale-110",
                      isActive && currentStep !== 'report' && "bg-foreground scale-125 shadow-lg",
                      !isActive && !isCompleted && currentStep !== 'report' && "bg-muted"
                    )}
                  />
                );
              })}
            </div>
            
            {/* 只在非最后一步时显示下一步按钮 */}
            {currentStep !== 'report' && (
              <Button
                onClick={onNext}
                disabled={!canGoNext}
                size="lg"
                className={cn(
                  "flex items-center gap-2 px-6 py-3 h-auto",
                  "bg-foreground text-background hover:bg-foreground/90 shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="text-left">
                  <div className="font-medium">下一步</div>
                  <div className="text-xs opacity-80">继续下一步骤</div>
                </div>
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            )}
            
            {/* 最后一步显示完成提示 */}
            {currentStep === 'report' && (
              <div className="flex items-center gap-2 px-6 py-3 h-auto bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-green-700 dark:text-green-400">研究完成</div>
                  <div className="text-xs text-green-600 dark:text-green-300">您已完成整个研究流程</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 进度指示 */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md text-sm text-muted-foreground">
            <span>步骤 {getStepNumber(currentStep)} / 4</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StepContent;