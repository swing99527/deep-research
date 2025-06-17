import React, { useState, useEffect, useCallback } from 'react';
import { useGlobalStore } from '@/store/global';
import StepNavigation from './StepNavigation';
import StepContent from './StepContent';

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep?: string;
  onStepChange?: (step: string) => void;
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  currentStep = 'topic',
  onStepChange
}) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [progress, setProgress] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const { 
    setOpenHistory, 
    setOpenKnowledge,
    setOpenSetting 
  } = useGlobalStore();

  // 根据当前步骤计算进度
  useEffect(() => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(activeStep);
    const calculatedProgress = ((currentIndex + 1) / stepOrder.length) * 100;
    setProgress(calculatedProgress);
  }, [activeStep]);

  // 自动保存功能
  useEffect(() => {
    if (activeStep !== 'topic') {
      setIsAutoSaving(true);
      const timer = setTimeout(() => {
        // 这里可以添加实际的保存逻辑
        setIsAutoSaving(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  // 处理步骤切换
  const handleStepClick = useCallback((stepId: string) => {
    setActiveStep(stepId);
    onStepChange?.(stepId);
  }, [onStepChange]);

  const handleNext = useCallback(() => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      handleStepClick(nextStep);
    }
  }, [activeStep, handleStepClick]);

  const handlePrevious = useCallback(() => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      handleStepClick(prevStep);
    }
  }, [activeStep, handleStepClick]);

  const canGoNext = useCallback(() => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(activeStep);
    return currentIndex < stepOrder.length - 1;
  }, [activeStep]);

  const canGoPrevious = useCallback(() => {
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(activeStep);
    return currentIndex > 0;
  }, [activeStep]);

  // 快速操作处理
  const handleHistoryClick = useCallback(() => {
    setOpenHistory(true);
  }, [setOpenHistory]);

  const handleKnowledgeClick = useCallback(() => {
    setOpenKnowledge(true);
  }, [setOpenKnowledge]);

  const handleNewResearchClick = useCallback(() => {
    // 重置到第一步
    handleStepClick('topic');
    // 这里可以添加清空数据的逻辑
  }, [handleStepClick]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只在没有焦点在输入元素时响应
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (event.key === 'ArrowLeft' && canGoPrevious()) {
        handlePrevious();
      } else if (event.key === 'ArrowRight' && canGoNext()) {
        handleNext();
      } else if (event.key === 'Escape') {
        setOpenSetting(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoNext, canGoPrevious, handleNext, handlePrevious, setOpenSetting]);

  return (
    <div className="max-w-7xl mx-auto flex min-h-screen bg-background relative">
      {/* 自动保存指示器 */}
      {isAutoSaving && (
        <div className="fixed top-4 right-4 z-50 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm animate-fade-in-up">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>自动保存中...</span>
          </div>
        </div>
      )}

      <StepNavigation
        currentStep={activeStep}
        onStepClick={handleStepClick}
        progress={progress}
        onHistoryClick={handleHistoryClick}
        onKnowledgeClick={handleKnowledgeClick}
        onNewResearchClick={handleNewResearchClick}
      />
      
      <StepContent
        currentStep={activeStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext()}
        canGoPrevious={canGoPrevious()}
      >
        {children}
      </StepContent>

      {/* 键盘快捷键提示 */}
      <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
        <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <div className="font-medium mb-2">键盘快捷键：</div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
            <span>上一步</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
            <span>下一步</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
            <span>设置</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout; 