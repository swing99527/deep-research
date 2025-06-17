import { create } from "zustand";

interface GlobalStore {
  openSetting: boolean;
  openHistory: boolean;
  openKnowledge: boolean;
  currentWizardStep: string;
}

interface GlobalFunction {
  setOpenSetting: (visible: boolean) => void;
  setOpenHistory: (visible: boolean) => void;
  setOpenKnowledge: (visible: boolean) => void;
  setCurrentWizardStep: (step: string) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const useGlobalStore = create<GlobalStore & GlobalFunction>((set, get) => ({
  openSetting: false,
  openHistory: false,
  openKnowledge: false,
  currentWizardStep: 'topic',
  setOpenSetting: (visible) => set({ openSetting: visible }),
  setOpenHistory: (visible) => set({ openHistory: visible }),
  setOpenKnowledge: (visible) => set({ openKnowledge: visible }),
  setCurrentWizardStep: (step) => set({ currentWizardStep: step }),
  goToNextStep: () => {
    const { currentWizardStep } = get();
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(currentWizardStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];
      set({ currentWizardStep: nextStep });
    }
  },
  goToPreviousStep: () => {
    const { currentWizardStep } = get();
    const stepOrder = ['topic', 'feedback', 'search', 'report'];
    const currentIndex = stepOrder.indexOf(currentWizardStep);
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1];
      set({ currentWizardStep: prevStep });
    }
  },
}));
