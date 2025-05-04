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
      search: "Search plans",
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
        title: "Create New Plan",
        placeholder: "E.g. Improve my coding skills, Launch a mobile app, Learn digital painting...",
        inputLabel: "Please enter an important goal you want to accomplish",
        next: "Next",
        quickMode: "Quick Mode (Skip clarification questions)",
        create: "Create Plan"
      },
      planCreated: "Plan created successfully",
      planCreationFailed: "Failed to create your plan"
    },
    navbar: {
      searchOrCommand: "Search or use commands...",
      backToDashboard: "Back to Dashboard"
    },
    workspace: {
      files: "Files",
      newFile: "New File",
      newFileDesc: "Create a new file",
      toggleLeftSidebar: "Toggle Left Sidebar",
      toggleLeftSidebarDesc: "Show or hide the file explorer",
      toggleAIAssistant: "Toggle AI Assistant",
      toggleAIAssistantDesc: "Show or hide the AI assistant panel",
      askAI: "Ask AI",
      askAIDesc: "Ask a question to the AI assistant",
      askInAIAssistant: "Please ask in the AI assistant panel",
      enterFileName: "Enter file name:",
      fileCreated: "File {{fileName}} created",
      fileAlreadyExists: "File {{fileName}} already exists",
      fileContent: "File content",
      noFileSelected: "No file selected"
    },
    commands: {
      searchPlaceholder: "Type a command or search...",
      enterToExecute: "Enter to execute",
      noMatchingCommands: "No matching commands found",
      navigate: "Navigate",
      execute: "Execute",
      close: "Close",
      goToDashboard: "Go to Dashboard",
      goToDashboardDesc: "Return to the task planning dashboard",
      commandNotFound: "Command not found"
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
    task: {
      newTask: "Create New Task",
      title: "Task Title",
      description: "Task Description",
      priority: "Priority",
      status: "Status",
      completed: "Completed",
      active: "Active",
      high: "High",
      medium: "Medium", 
      low: "Low",
      titlePlaceholder: "Enter task title",
      descriptionPlaceholder: "Enter task description (optional)",
      titleRequired: "Title is required",
      createTask: "Create Task",
      processing: "Processing...",
      cancel: "Cancel",
      taskCreated: "Task created successfully",
      taskCreationFailed: "Failed to create task, please try again",
      noStageSelected: "No stage selected to add task",
      addFirstTask: "Add first task",
      addTask: "Add task",
      editTask: "Edit task",
      markComplete: "Mark as complete",
      undoComplete: "Undo complete",
      addDescription: "Add description"
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
      title: "任务计划",
      emptyTitle: "你还没有任务",
      emptyCTA: "规划你的第一个大事",
      focusTask: "焦点任务",
      stage: "当前阶段",
      progress: "进度",
      tasksToday: "今日任务",
      noStage: "无阶段",
      search: "搜索计划",
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
        title: "创建新计划",
        placeholder: "例如：提高编程技能、发布一个手机应用、学习数字绘画...",
        inputLabel: "请输入你想完成的一件大事",
        next: "下一步",
        quickMode: "快速模式（跳过问题澄清步骤）",
        create: "创建计划"
      },
      planCreated: "计划创建成功",
      planCreationFailed: "创建计划失败"
    },
    navbar: {
      searchOrCommand: "搜索或使用命令...",
      backToDashboard: "返回任务计划"
    },
    workspace: {
      files: "文件",
      newFile: "新建文件",
      newFileDesc: "创建一个新的文件",
      toggleLeftSidebar: "切换左侧栏",
      toggleLeftSidebarDesc: "显示或隐藏左侧文件栏",
      toggleAIAssistant: "切换AI助手",
      toggleAIAssistantDesc: "显示或隐藏右侧AI助手",
      askAI: "询问AI",
      askAIDesc: "直接向AI助手提问",
      askInAIAssistant: "请在AI助手栏中提问",
      enterFileName: "请输入文件名:",
      fileCreated: "文件 {{fileName}} 已创建",
      fileAlreadyExists: "文件 {{fileName}} 已存在",
      fileContent: "文件内容",
      noFileSelected: "没有选择文件"
    },
    commands: {
      searchPlaceholder: "输入命令或搜索...",
      enterToExecute: "回车执行",
      noMatchingCommands: "没有找到匹配的命令",
      navigate: "导航",
      execute: "执行",
      close: "关闭",
      goToDashboard: "返回任务计划",
      goToDashboardDesc: "返回到任务计划页面",
      commandNotFound: "找不到命令"
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
    task: {
      newTask: "创建新任务",
      title: "任务标题",
      description: "任务描述",
      priority: "优先级",
      status: "状态",
      completed: "已完成",
      active: "进行中",
      high: "高",
      medium: "中", 
      low: "低",
      titlePlaceholder: "输入任务标题",
      descriptionPlaceholder: "输入任务描述（选填）",
      titleRequired: "标题不能为空",
      createTask: "创建任务",
      processing: "处理中...",
      cancel: "取消",
      taskCreated: "任务创建成功",
      taskCreationFailed: "创建任务失败，请重试",
      noStageSelected: "未选择阶段，无法添加任务",
      addFirstTask: "添加第一个任务",
      addTask: "添加任务",
      editTask: "编辑任务",
      markComplete: "标记为完成",
      undoComplete: "撤销完成",
      addDescription: "添加描述"
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
  | 'dashboard.search'
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
  | 'dashboard.planCreated'
  | 'dashboard.planCreationFailed'
  | 'navbar.searchOrCommand'
  | 'navbar.backToDashboard'
  | 'workspace.files'
  | 'workspace.newFile'
  | 'workspace.newFileDesc'
  | 'workspace.toggleLeftSidebar'
  | 'workspace.toggleLeftSidebarDesc'
  | 'workspace.toggleAIAssistant'
  | 'workspace.toggleAIAssistantDesc'
  | 'workspace.askAI'
  | 'workspace.askAIDesc'
  | 'workspace.askInAIAssistant'
  | 'workspace.enterFileName'
  | 'workspace.fileCreated'
  | 'workspace.fileAlreadyExists'
  | 'workspace.fileContent'
  | 'workspace.noFileSelected'
  | 'commands.searchPlaceholder'
  | 'commands.enterToExecute'
  | 'commands.noMatchingCommands'
  | 'commands.navigate'
  | 'commands.execute'
  | 'commands.close'
  | 'commands.goToDashboard'
  | 'commands.goToDashboardDesc'
  | 'commands.commandNotFound'
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
  | 'dashboard.newPlanDialog.quickMode'
  | 'dashboard.newPlanDialog.create'
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
  | 'clarify.error.planCreationFailed'
  | 'task.newTask'
  | 'task.title'
  | 'task.description'
  | 'task.priority'
  | 'task.status'
  | 'task.completed'
  | 'task.active'
  | 'task.high'
  | 'task.medium'
  | 'task.low'
  | 'task.titlePlaceholder'
  | 'task.descriptionPlaceholder'
  | 'task.titleRequired'
  | 'task.createTask'
  | 'task.processing'
  | 'task.cancel'
  | 'task.taskCreated'
  | 'task.taskCreationFailed'
  | 'task.noStageSelected'
  | 'task.addFirstTask'
  | 'task.addTask'
  | 'task.editTask'
  | 'task.markComplete'
  | 'task.undoComplete'
  | 'task.addDescription';

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