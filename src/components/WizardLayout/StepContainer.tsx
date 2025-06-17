import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/style';

interface StepContainerProps {
  step: string;
  currentStep: string;
  children: React.ReactNode;
  className?: string;
}

const StepContainer: React.FC<StepContainerProps> = ({
  step,
  currentStep,
  children,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const isActive = step === currentStep;

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      // 短暂延迟以确保DOM更新
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      // 等待动画完成后再移除
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isVisible 
          ? "opacity-100 translate-x-0 scale-100" 
          : "opacity-0 translate-x-4 scale-95",
        className
      )}
      style={{
        transitionDelay: isVisible ? '0ms' : '0ms'
      }}
    >
      <div className={cn(
        "transform transition-all duration-500 ease-out",
        isVisible && "animate-fade-in-up"
      )}>
        {children}
      </div>
    </div>
  );
};

export default StepContainer; 