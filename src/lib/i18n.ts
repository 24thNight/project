export const translations = {
  en: {
    dashboard: {
      title: "Task Planning Dashboard",
      emptyTitle: "No tasks yet",
      emptyCTA: "Start your first plan",
      focusTask: "Focus Task",
      stage: "Current Stage",
      progress: "Progress",
      tasksToday: "Today's Tasks",
      noStage: "No Stage",
      actions: {
        enter: "Enter",
        summary: "Summary",
        delete: "Delete",
        rename: "Rename"
      },
      status: {
        ongoing: "Ongoing",
        delayed: "Delayed",
        days: "days"
      },
      nav: {
        cards: "Cards",
        focus: "Focus",
        trash: "Trash"
      },
      settings: "Settings",
      language: "Language",
      newPlan: "New Plan",
      addNewPlan: "Add New Plan",
      clickToAdd: "Click to create a new plan",
      renamePlan: "Rename Plan",
      cancel: "Cancel",
      save: "Save",
      planNamePlaceholder: "Enter plan name",
      newPlanDialog: {
        title: "Add New Plan",
        placeholder: "Enter something important you want to achieve...",
        inputLabel: "Please enter an important goal you want to accomplish",
        next: "Next"
      }
    },
    clarify: {
      title: "Planning Your Goal",
      yourGoal: "Your Goal:",
      answerPlaceholder: "Type your answer...",
      waiting: "Thinking...",
      processing: "Processing your goal...",
      back: "Back to Dashboard",
      continue: "Continue",
      enterToSubmit: "Press Enter to submit",
      loadingQuestions: "Loading questions...",
      waitingNext: "Waiting for the next question...",
      allQuestionsAnswered: "All questions answered. Preparing your plan...",
      waitingMoreQuestions: "Please wait for more questions from the AI",
      answerAllFirst: "Please answer all questions first",
      allQuestionsReceived: "All questions received! You can continue when you've answered all questions.",
      pleaseAnswerAll: "Please complete all questions before continuing",
      generatingPlan: "Generating your plan...",
      error: {
        missingTitle: "Missing task title",
        startFailed: "Failed to start clarification process",
        sseError: "Error connecting to the server",
        generic: "An error occurred",
        planCreationFailed: "Failed to create your plan"
      }
    },
    api: {
      errors: {
        default: "An error occurred, please try again later",
        fetch: "Failed to load data",
        create: "Failed to create",
        update: "Failed to update",
        delete: "Failed to delete",
        network: "Network error, please check your connection"
      },
      success: {
        create: "Created successfully",
        update: "Updated successfully",
        delete: "Deleted successfully",
        rename: "Renamed successfully"
      },
      tests: {
        title: "API Testing Tool",
        fetchPlans: "Fetch Plans",
        createPlan: "Create New Plan",
        updatePlan: "Update Plan Progress",
        deletePlan: "Delete Plan (Last One)",
        result: "Test Result:",
        loading: "Loading...",
        clickToTest: "Click the buttons above to test the API"
      }
    }
  },
  zh: {
    dashboard: {
      title: "任务计划工作台",
      emptyTitle: "你还没有任务",
      emptyCTA: "规划你的第一个大事",
      focusTask: "焦点任务",
      stage: "当前阶段",
      progress: "进度",
      tasksToday: "今日任务",
      noStage: "无阶段",
      actions: {
        enter: "进入",
        summary: "总结",
        delete: "删除",
        rename: "重命名"
      },
      status: {
        ongoing: "进行中",
        delayed: "已拖延",
        days: "天"
      },
      nav: {
        cards: "卡片",
        focus: "专注",
        trash: "回收站"
      },
      settings: "设置",
      language: "语言",
      newPlan: "新计划",
      addNewPlan: "添加新计划",
      clickToAdd: "点击创建新计划",
      renamePlan: "重命名计划",
      cancel: "取消",
      save: "保存",
      planNamePlaceholder: "输入计划名称",
      newPlanDialog: {
        title: "添加新计划",
        placeholder: "请输入你想完成的一件大事（如：考研、写小说、找工作…）",
        inputLabel: "请输入你想完成的一件大事",
        next: "下一步"
      }
    },
    clarify: {
      title: "正在规划你的目标",
      yourGoal: "你的目标是：",
      answerPlaceholder: "输入你的回答...",
      waiting: "思考中...",
      processing: "正在处理你的目标...",
      back: "返回首页",
      continue: "继续",
      enterToSubmit: "按Enter提交",
      loadingQuestions: "正在加载问题...",
      waitingNext: "等待下一个问题...",
      allQuestionsAnswered: "所有问题已回答完毕，正在准备你的计划...",
      waitingMoreQuestions: "请等待AI提出更多问题",
      answerAllFirst: "请先回答所有问题",
      allQuestionsReceived: "所有问题已接收完毕！完成所有问题后即可继续。",
      pleaseAnswerAll: "请在继续前完成所有问题",
      generatingPlan: "正在生成你的计划...",
      error: {
        missingTitle: "缺少任务标题",
        startFailed: "启动澄清过程失败",
        sseError: "连接服务器时出错",
        generic: "发生错误",
        planCreationFailed: "创建计划失败"
      }
    },
    api: {
      errors: {
        default: "发生错误，请稍后重试",
        fetch: "加载数据失败",
        create: "创建失败",
        update: "更新失败",
        delete: "删除失败",
        network: "网络错误，请检查您的连接"
      },
      success: {
        create: "创建成功",
        update: "更新成功",
        delete: "删除成功",
        rename: "重命名成功"
      },
      tests: {
        title: "API 接口测试",
        fetchPlans: "获取计划列表",
        createPlan: "创建新计划",
        updatePlan: "更新计划进度",
        deletePlan: "删除计划(最后一个)",
        result: "测试结果：",
        loading: "加载中...",
        clickToTest: "点击上方按钮测试API接口"
      }
    }
  }
};

export type Language = 'en' | 'zh';

export type TranslationKey = 
  | 'dashboard.title'
  | 'dashboard.emptyTitle'
  | 'dashboard.emptyCTA'
  | 'dashboard.focusTask'
  | 'dashboard.stage'
  | 'dashboard.progress'
  | 'dashboard.tasksToday'
  | 'dashboard.noStage'
  | 'dashboard.actions.enter'
  | 'dashboard.actions.summary'
  | 'dashboard.actions.delete'
  | 'dashboard.actions.rename'
  | 'dashboard.status.ongoing'
  | 'dashboard.status.delayed'
  | 'dashboard.status.days'
  | 'dashboard.nav.cards'
  | 'dashboard.nav.focus'
  | 'dashboard.nav.trash'
  | 'dashboard.settings'
  | 'dashboard.language'
  | 'dashboard.newPlan'
  | 'dashboard.addNewPlan'
  | 'dashboard.clickToAdd'
  | 'dashboard.renamePlan'
  | 'dashboard.cancel'
  | 'dashboard.save'
  | 'dashboard.planNamePlaceholder'
  | 'api.errors.default'
  | 'api.errors.fetch'
  | 'api.errors.create'
  | 'api.errors.update'
  | 'api.errors.delete'
  | 'api.errors.network'
  | 'api.success.create'
  | 'api.success.update'
  | 'api.success.delete'
  | 'api.success.rename'
  | 'api.tests.title'
  | 'api.tests.fetchPlans'
  | 'api.tests.createPlan'
  | 'api.tests.updatePlan'
  | 'api.tests.deletePlan'
  | 'api.tests.result'
  | 'api.tests.loading'
  | 'api.tests.clickToTest'
  | 'dashboard.newPlanDialog.title'
  | 'dashboard.newPlanDialog.placeholder'
  | 'dashboard.newPlanDialog.inputLabel'
  | 'dashboard.newPlanDialog.next'
  | 'clarify.title'
  | 'clarify.yourGoal'
  | 'clarify.answerPlaceholder'
  | 'clarify.waiting'
  | 'clarify.processing'
  | 'clarify.back'
  | 'clarify.continue'
  | 'clarify.enterToSubmit'
  | 'clarify.loadingQuestions'
  | 'clarify.waitingNext'
  | 'clarify.allQuestionsAnswered'
  | 'clarify.waitingMoreQuestions'
  | 'clarify.answerAllFirst'
  | 'clarify.allQuestionsReceived'
  | 'clarify.pleaseAnswerAll'
  | 'clarify.generatingPlan'
  | 'clarify.error.missingTitle'
  | 'clarify.error.startFailed'
  | 'clarify.error.sseError'
  | 'clarify.error.generic'
  | 'clarify.error.planCreationFailed';

export function t(key: TranslationKey, lang: Language = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // Fallback to the key if translation not found
    }
  }
  
  return value;
} 