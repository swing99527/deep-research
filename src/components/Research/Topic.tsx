"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  LoaderCircle,
  SquarePlus,
  FilePlus,
  BookText,
  Paperclip,
  Link,
  Sparkles,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ResourceList from "@/components/Knowledge/ResourceList";
import Crawler from "@/components/Knowledge/Crawler";
import { Button } from "@/components/Internal/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDeepResearch from "@/hooks/useDeepResearch";
import useAiProvider from "@/hooks/useAiProvider";
import useKnowledge from "@/hooks/useKnowledge";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";

const formSchema = z.object({
  topic: z.string().min(2),
});

function Topic() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskStore = useTaskStore();
  const { goToNextStep } = useGlobalStore();
  const { askQuestions } = useDeepResearch();
  const { hasApiKey } = useAiProvider();
  const { getKnowledgeFromFile } = useKnowledge();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [openCrawler, setOpenCrawler] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: taskStore.question,
    },
  });

  function handleCheck(): boolean {
    const { mode } = useSettingStore.getState();
    if ((mode === "local" && hasApiKey()) || mode === "proxy") {
      return true;
    } else {
      const { setOpenSetting } = useGlobalStore.getState();
      setOpenSetting(true);
      return false;
    }
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (handleCheck()) {
      const { id, setQuestion } = useTaskStore.getState();
      try {
        setIsThinking(true);
        accurateTimerStart();
        if (id !== "") {
          createNewResearch();
          form.setValue("topic", values.topic);
        }
        setQuestion(values.topic);
        await askQuestions();
      } finally {
        setIsThinking(false);
        accurateTimerStop();
      }
    }
  }

  function createNewResearch() {
    const { id, backup, reset } = useTaskStore.getState();
    const { update } = useHistoryStore.getState();
    if (id) update(id, backup());
    reset();
    form.reset();
  }

  function openKnowledgeList() {
    const { setOpenKnowledge } = useGlobalStore.getState();
    setOpenKnowledge(true);
  }

  async function handleFileUpload(files: FileList | null) {
    if (files) {
      for await (const file of files) {
        await getKnowledgeFromFile(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleNextStep() {
    goToNextStep();
  }

  // 检查是否已完成研究主题思考
  const isTopicCompleted = taskStore.questions !== "";

  useEffect(() => {
    form.setValue("topic", taskStore.question);
  }, [taskStore.question, form]);

  return (
    <section className="card-research animate-scale-in">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gradient">
              {t("research.topic.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              Start your AI-powered research journey
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => createNewResearch()}
          title={t("research.common.newResearch")}
          className="btn-ghost-modern"
        >
          <SquarePlus className="h-5 w-5" />
        </Button>
      </div>

      {/* 完成状态提示 */}
      {isTopicCompleted && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">
                研究主题已确定
              </h4>
              <p className="text-sm text-green-600 dark:text-green-300 mb-4">
                AI已成功分析您的研究主题并生成了相关问题。您可以继续下一步制定详细的研究计划。
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-300">
                  <Clock className="w-3 h-3" />
                  <span>主题分析完成</span>
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>准备进入研究计划阶段</span>
                </div>
                <Button
                  onClick={handleNextStep}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span className="mr-2">进入下一步</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 研究主题输入 */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <span>{t("research.topic.topicLabel")}</span>
                  <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                  {isTopicCompleted && (
                    <div className="flex items-center gap-1 ml-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">已完成</span>
                    </div>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      rows={3}
                      placeholder={t("research.topic.topicPlaceholder")}
                      className={`input-modern resize-none text-base leading-relaxed min-h-[120px] pr-12 ${
                        isTopicCompleted ? 'border-green-500/30 bg-green-500/5' : ''
                      }`}
                      {...field}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                      {field.value?.length || 0} / 1000
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* 本地资源部分 */}
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-semibold flex items-center gap-2">
              <span>{t("knowledge.localResourceTitle")}</span>
              <span className="px-2 py-1 text-xs bg-primary/10 dark:bg-primary/20 text-primary rounded-md font-medium">
                选填
              </span>
            </FormLabel>
            <FormControl>
              <div className="space-y-4">
                {/* 已添加的资源 */}
                {taskStore.resources.length > 0 && (
                  <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <ResourceList
                      resources={taskStore.resources}
                      onRemove={taskStore.removeResource}
                    />
                  </div>
                )}

                {/* 添加资源按钮 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-full flex items-center justify-start gap-3 h-12 px-3 text-muted-foreground hover:text-foreground border-dashed border-2 border-border hover:border-primary/30 hover:bg-primary/5 rounded-lg cursor-pointer transition-all duration-200">
                      <FilePlus className="w-5 h-5" />
                      <span className="font-medium">{t("knowledge.addResource")}</span>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56"
                    align="start"
                    side="bottom"
                    sideOffset={8}
                  >
                    <DropdownMenuItem 
                      onClick={() => {
                        if (handleCheck()) {
                          openKnowledgeList();
                        }
                      }}
                    >
                      <BookText className="w-4 h-4" />
                      <span>{t("knowledge.knowledge")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (handleCheck()) {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{t("knowledge.localFile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (handleCheck()) {
                          setOpenCrawler(true);
                        }
                      }}
                    >
                      <Link className="w-4 h-4" />
                      <span>{t("knowledge.webPage")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </FormControl>
          </FormItem>

          {/* 提交按钮 */}
          <Button 
            className={`w-full h-14 text-base font-semibold transition-all duration-300 ${
              isThinking 
                ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg" 
                : "btn-primary-gradient text-lg"
            }`}
            disabled={isThinking} 
            type="submit"
          >
            {isThinking ? (
              <div className="flex items-center gap-3">
                <LoaderCircle className="animate-spin h-5 w-5" />
                <span>{t("research.common.thinkingQuestion")}</span>
                <div className="flex items-center gap-1 text-sm opacity-80">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formattedTime}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5" />
                <span>
                  {taskStore.questions === "" 
                    ? t("research.common.startThinking")
                    : t("research.common.rethinking")
                  }
                </span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            )}
          </Button>
        </form>
      </Form>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(ev) => handleFileUpload(ev.target.files)}
      />

      {/* 爬虫组件 */}
      <Crawler
        open={openCrawler}
        onClose={() => setOpenCrawler(false)}
      />
    </section>
  );
}

export default Topic;
