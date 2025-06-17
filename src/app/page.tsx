"use client";
import dynamic from "next/dynamic";
import { useLayoutEffect } from "react";

import { useTheme } from "next-themes";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";

const Header = dynamic(() => import("@/components/Internal/Header"));
const Setting = dynamic(() => import("@/components/Setting"));
const Topic = dynamic(() => import("@/components/Research/Topic"));
const Feedback = dynamic(() => import("@/components/Research/Feedback"));
const SearchResult = dynamic(
  () => import("@/components/Research/SearchResult")
);
const FinalReport = dynamic(() => import("@/components/Research/FinalReport"));
const History = dynamic(() => import("@/components/History"));
const Knowledge = dynamic(() => import("@/components/Knowledge"));

// 导入向导式布局组件
const WizardLayout = dynamic(() => import("@/components/WizardLayout/WizardLayout"));
const StepContainer = dynamic(() => import("@/components/WizardLayout/StepContainer"));

function Home() {
  const {
    openSetting,
    setOpenSetting,
    openHistory,
    setOpenHistory,
    openKnowledge,
    setOpenKnowledge,
    currentWizardStep,
    setCurrentWizardStep,
  } = useGlobalStore();

  const { theme } = useSettingStore();
  const { setTheme } = useTheme();

  useLayoutEffect(() => {
    const settingStore = useSettingStore.getState();
    setTheme(settingStore.theme);
  }, [theme, setTheme]);

  const handleStepChange = (step: string) => {
    setCurrentWizardStep(step);
  };
  
  return (
    <div className="min-h-screen bg-gradient-main relative overflow-x-hidden">
      {/* 背景装饰元素 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* 主要装饰圆圈 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/[0.03] rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500/[0.02] rounded-full blur-2xl animate-pulse-slow" />
        
        {/* 网格背景 */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="animate-fade-in-up">
          <Header />
        </div>
        
        {/* 向导式布局主体 */}
        <WizardLayout 
          currentStep={currentWizardStep} 
          onStepChange={handleStepChange}
        >
          {/* 步骤1: 研究主题 */}
          <StepContainer step="topic" currentStep={currentWizardStep}>
            <Topic />
          </StepContainer>
          
          {/* 步骤2: 研究计划 */}
          <StepContainer step="feedback" currentStep={currentWizardStep}>
            <Feedback />
          </StepContainer>
          
          {/* 步骤3: 信息收集 */}
          <StepContainer step="search" currentStep={currentWizardStep}>
            <SearchResult />
          </StepContainer>
          
          {/* 步骤4: 结果分析和撰写报告 */}
          <StepContainer step="report" currentStep={currentWizardStep}>
            <FinalReport />
          </StepContainer>
        </WizardLayout>
        
        {/* 页脚 - 简化版本 */}
        <footer className="mt-8 py-4 print:hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="w-full h-px bg-border/20 mb-4" />
              <div className="text-xs text-muted-foreground/50">
                © 2024 LINGBRAIN 灵思
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* 侧边面板 - 保持原有功能 */}
      <aside className="print:hidden">
        <Setting open={openSetting} onClose={() => setOpenSetting(false)} />
        <History open={openHistory} onClose={() => setOpenHistory(false)} />
        <Knowledge
          open={openKnowledge}
          onClose={() => setOpenKnowledge(false)}
        />
      </aside>
    </div>
  );
}

export default Home;
