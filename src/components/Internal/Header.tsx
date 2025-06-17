"use client";
import { useTranslation } from "react-i18next";
import { Settings, History, BookText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/Internal/Button";
import { useGlobalStore } from "@/store/global";

const VERSION = process.env.NEXT_PUBLIC_VERSION;

function Header() {
  const { t } = useTranslation();
  const { setOpenSetting, setOpenHistory, setOpenKnowledge } = useGlobalStore();

  return (
    <header className="print:hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-6 mb-6 px-4">
      {/* 品牌区域 */}
      <div className="flex items-center gap-4">
        <div className="group flex items-center gap-3 transition-all duration-300 hover:scale-105 will-change-transform">
          {/* LINGBRAIN 品牌信息 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/lingbrain.png"
                alt="lingbrain.logo"
                width={140}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                深度研究
              </span>
              <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                v{VERSION}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 导航区域 */}
      <nav className="flex items-center gap-2">
        {/* 主要功能按钮 */}
        <div className="flex items-center gap-1 mr-3">

          
          <Button
            className="relative group btn-ghost-modern"
            variant="ghost"
            size="icon"
            title={t("history.title")}
            onClick={() => setOpenHistory(true)}
          >
            <History className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm">
              {t("history.title")}
            </span>
          </Button>
          
          <Button
            className="relative group btn-ghost-modern"
            variant="ghost"
            size="icon"
            title={t("knowledge.title")}
            onClick={() => setOpenKnowledge(true)}
          >
            <BookText className="h-5 w-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm">
              {t("knowledge.title")}
            </span>
          </Button>
        </div>
        
        {/* 设置按钮（强调） */}
        <Button
          className="relative group bg-foreground text-background hover:bg-foreground/90 shadow-lg"
          variant="default"
          size="icon"
          title={t("setting.title")}
          onClick={() => setOpenSetting(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover/95 text-popover-foreground rounded-md shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-sm">
            {t("setting.title")}
          </span>
        </Button>
      </nav>
      </div>
    </header>
  );
}

export default Header;
