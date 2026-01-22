"use client"

// Multi-language support for Lab68 Platform

export type Language = "en" | "vi"

export interface Translations {
  // Navigation
  nav: {
    home: string
    dashboard: string
    projects: string
    aiTools: string
    community: string
    settings: string
    signIn: string
    signUp: string
    signOut: string
    todo: string
    meeting: string
    planning: string
    diagrams: string
  }
  // Auth
  auth: {
    signIn: string
    signUp: string
    email: string
    password: string
    name: string
    createAccount: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    signInButton: string
    signUpButton: string
    rememberMe: string
  }
  // Dashboard
  dashboard: {
    welcomeBack: string
    happeningToday: string
    loading: string
    activeUsers: string
    totalBuilds: string
    repositories: string
    apiCalls: string
    recentProjects: string
    aiAssistant: string
    systemStatus: string
    askAnything: string
    send: string
    allSystemsOperational: string
    buildsInProgress: string
    connectedAndHealthy: string
  }
  // Settings
  settings: {
    title: string
    subtitle: string
    profile: string
    username: string
    email: string
    userId: string
    memberSince: string
    saveChanges: string
    notifications: string
    emailNotifications: string
    emailNotificationsDesc: string
    buildNotifications: string
    buildNotificationsDesc: string
    meetingNotifications: string
    meetingNotificationsDesc: string
    security: string
    currentPassword: string
    newPassword: string
    updatePassword: string
    appearance: string
    theme: string
    darkMode: string
    lightMode: string
    currentTheme: string
    comingSoon: string
    language: string
    selectLanguage: string
    dangerZone: string
    dangerZoneDesc: string
    deleteAccount: string
    avatar: string
    uploadAvatar: string
    removeAvatar: string
    bio: string
  }
  // Notifications
  notifications: {
    title: string
    noUpcoming: string
    startsIn: string
  }
  // Landing Page
  landing: {
    hero: {
      title: string
      subtitle: string
      cta: string
      badge: string
    }
    stats: {
      features: string
      openSource: string
      available: string
    }
    mission: {
      title: string
      description: string
    }
    techStack: {
      title: string
      description: string
      poweredBy: string
    }
    services: {
      title: string
      subtitle: string
      badge: string
      learnMore: string
      projectManagement: string
      projectManagementDesc: string
      aiAssistant: string
      aiAssistantDesc: string
      collaboration: string
      collaborationDesc: string
      fileManagement: string
      fileManagementDesc: string
      diagrams: string
      diagramsDesc: string
      resumeEditor: string
      resumeEditorDesc: string
      gamesHub: string
      gamesHubDesc: string
      wiki: string
      wikiDesc: string
      meetingPlanning: string
      meetingPlanningDesc: string
      liveSupport: string
      liveSupportDesc: string
    }
    community: {
      title: string
      description: string
      stayUpdated: string
      subscribe: string
      visitGithub: string
    }
    whyChoose: {
      title: string
      subtitle: string
      fast: string
      fastDesc: string
      secure: string
      secureDesc: string
      allInOne: string
      allInOneDesc: string
      ctaTitle: string
      ctaSubtitle: string
      getStartedFree: string
      exploreFeatures: string
    }
    team: {
      title: string
      subtitle: string
      founder: string
      coFounder: string
      developer: string
      viewRepo: string
    }
    sponsor: {
      title: string
      subtitle: string
      badge: string
      buyMeCoffee: string
      buyMeCoffeeDesc: string
      githubSponsors: string
      githubSponsorsDesc: string
    }
  }
  // To Do feature
  todo: {
    title: string
    subtitle: string
    addTask: string
    taskName: string
    taskDescription: string
    priority: string
    low: string
    medium: string
    high: string
    create: string
    noTasks: string
    startAdding: string
    completed: string
    pending: string
    markComplete: string
    markIncomplete: string
    delete: string
  }
  // Meeting feature
  meeting: {
    title: string
    subtitle: string
    scheduleMeeting: string
    meetingTitle: string
    meetingDescription: string
    date: string
    time: string
    duration: string
    minutes: string
    schedule: string
    noMeetings: string
    startScheduling: string
    upcoming: string
    past: string
    cancel: string
  }
  // Planning feature
  planning: {
    title: string
    subtitle: string
    createPlan: string
    planName: string
    planDescription: string
    startDate: string
    endDate: string
    status: string
    notStarted: string
    inProgress: string
    completed: string
    create: string
    noPlans: string
    startPlanning: string
    addMilestone: string
    milestoneName: string
    milestoneDate: string
    delete: string
  }
  // Projects feature
  projects: {
    title: string
    subtitle: string
    newProject: string
    projectName: string
    projectDescription: string
    technologies: string
    status: string
    active: string
    building: string
    inProgress: string
    create: string
    noProjects: string
    startCreating: string
    lastUpdated: string
    edit: string
    delete: string
    cancel: string
    save: string
    editProject: string
    kanban: string
    viewKanban: string
    collaborators: string
    addCollaborator: string
    inviteByEmail: string
    invite: string
    removeCollaborator: string
    owner: string
    noCollaborators: string
    role: string
    selectRole: string
    roleOwner: string
    roleAdmin: string
    roleEditor: string
    roleViewer: string
    permissions: string
    canEdit: string
    canDelete: string
    canInvite: string
    canManageRoles: string
    canViewActivity: string
    activity: string
    recentActivity: string
    noActivity: string
    lastActive: string
    addedBy: string
    changeRole: string
    member: string
    members: string
  }
  // Community feature
  community: {
    title: string
    subtitle: string
    newDiscussion: string
    discussionTitle: string
    discussionContent: string
    category: string
    selectCategory: string
    customCategory: string
    post: string
    noDiscussions: string
    startDiscussion: string
    replies: string
    by: string
    cancel: string
    // Predefined categories
    general: string
    help: string
    showcase: string
    feedback: string
    announcements: string
  }
  // Kanban feature
  kanban: {
    title: string
    backToProjects: string
    addCard: string
    addColumn: string
    columnName: string
    cardTitle: string
    cardDescription: string
    assignee: string
    dueDate: string
    create: string
    cancel: string
    deleteCard: string
    deleteColumn: string
    editCard: string
    save: string
    noCards: string
    dragCard: string
  }
  diagrams: {
    editLabel: string
    title: string
    createNew: string
    noDiagrams: string
    noDiagramsDesc: string
    diagramName: string
    description: string
    create: string
    edit: string
    delete: string
    confirmDelete: string
    cancel: string
    save: string
    addNode: string
    addConnection: string
    nodeTypes: {
      start: string
      process: string
      decision: string
      end: string
      data: string
      document: string
      cloud: string
      hexagon: string
      parallelogram: string
      text: string
    }
    tools: {
      select: string
      move: string
      delete: string
      connect: string
    }
    exportImage: string
    exportJSON: string
    clear: string
    zoom: string
    saved: string
  }
  // Chat & Messaging
  chat: {
    title: string
    newChat: string
    newGroup: string
    searchMessages: string
    typeMessage: string
    send: string
    edit: string
    delete: string
    reply: string
    react: string
    copyText: string
    noMessages: string
    startConversation: string
    typing: string
    isTyping: string
    areTyping: string
    online: string
    offline: string
    lastSeen: string
    readBy: string
    unread: string
    markAsRead: string
    createRoom: string
    roomName: string
    addMembers: string
    directMessage: string
    groupChat: string
    projectChat: string
    members: string
    leaveChat: string
    deleteChat: string
    confirmDelete: string
    cancel: string
    edited: string
    uploadFile: string
    attachFile: string
    sendingFile: string
    fileUploaded: string
    fileTooLarge: string
    maxFileSize: string
    selectEmoji: string
  }
  // Comments & Mentions
  comments: {
    title: string
    addComment: string
    typeComment: string
    post: string
    edit: string
    delete: string
    reply: string
    resolve: string
    resolved: string
    unresolve: string
    noComments: string
    startDiscussion: string
    mention: string
    mentionSomeone: string
    showResolved: string
    hideResolved: string
    sortBy: string
    newest: string
    oldest: string
    mostReplies: string
    cancel: string
    save: string
    confirmDelete: string
    edited: string
    replying: string
    replyingTo: string
    viewReplies: string
    hideReplies: string
    replies: string
    react: string
    reactions: string
    mentionedYou: string
    inComment: string
    onTask: string
    onDiagram: string
    onProject: string
    onFile: string
    exportJSON: string
    clear: string
    zoom: string
  }
  // Whiteboard
  whiteboard: {
    title: string
    newWhiteboard: string
    whiteboardName: string
    description: string
    create: string
    open: string
    delete: string
    confirmDelete: string
    noWhiteboards: string
    startDrawing: string
    save: string
    export: string
    exportPNG: string
    exportSVG: string
    tools: string
    pen: string
    line: string
    rectangle: string
    circle: string
    ellipse: string
    text: string
    eraser: string
    select: string
    color: string
    customColor: string
    strokeWidth: string
    fillShape: string
    fillColor: string
    fontSize: string
    undo: string
    redo: string
    clearAll: string
    confirmClear: string
    elements: string
    collaborators: string
    updated: string
    backToWhiteboards: string
    enterText: string
    saved: string
  }
  // Files feature
  files: {
    title: string
    subtitle: string
    uploadFile: string
    addLink: string
    fileName: string
    fileDescription: string
    fileUrl: string
    linkUrl: string
    linkTitle: string
    linkDescription: string
    upload: string
    addLinkButton: string
    cancel: string
    noFiles: string
    startUploading: string
    uploadedBy: string
    linkedBy: string
    delete: string
    download: string
    openLink: string
    type: string
    uploaded: string
    linked: string
    relatedTo: string
    project: string
    task: string
    meeting: string
    design: string
    documentation: string
    planning: string
    research: string
    general: string
    architecture: string
  }
  // Wiki feature
  wiki: {
    title: string
    subtitle: string
    createArticle: string
    articleTitle: string
    articleContent: string
    category: string
    tags: string
    tagsPlaceholder: string
    create: string
    edit: string
    delete: string
    cancel: string
    save: string
    noArticles: string
    startWriting: string
    lastUpdated: string
    author: string
    readMore: string
    backToList: string
    confirmDelete: string
    // Categories
    processes: string
    bestPractices: string
    projectSummaries: string
    tutorials: string
    documentation: string
    guidelines: string
    api: string
    troubleshooting: string
    faq: string
    architecture: string
  }
}

const defaultFilesTranslations = {
  title: "Files & Documents",
  subtitle: "Store, share, and manage project files and links",
  uploadFile: "Upload File",
  addLink: "Add Link",
  fileName: "File Name",
  fileDescription: "Description",
  fileUrl: "File URL",
  linkUrl: "Link URL",
  linkTitle: "Link Title",
  linkDescription: "Link Description",
  upload: "Upload",
  addLinkButton: "Add Link",
  cancel: "Cancel",
  noFiles: "No files or links yet",
  startUploading: "Upload your first file or add a link to get started",
  uploadedBy: "Uploaded by",
  linkedBy: "Added by",
  delete: "Delete",
  download: "Download",
  openLink: "Open Link",
  type: "Type",
  uploaded: "Uploaded",
  linked: "Link",
  relatedTo: "Related To",
  project: "Project",
  task: "Task",
  meeting: "Meeting",
  design: "Design",
  documentation: "Documentation",
  planning: "Planning",
  research: "Research",
  general: "General",
}

const defaultWikiTranslations = {
  title: "Knowledge Base",
  subtitle: "Document processes, best practices, and project summaries",
  createArticle: "Create Article",
  articleTitle: "Article Title",
  articleContent: "Content",
  category: "Category",
  tags: "Tags",
  tagsPlaceholder: "Add tags separated by commas",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  noArticles: "No articles yet",
  startWriting: "Create your first article to start building your knowledge base",
  lastUpdated: "Last updated",
  author: "Author",
  readMore: "Read More",
  backToList: "Back to Articles",
  confirmDelete: "Are you sure you want to delete this article?",
  processes: "Processes",
  bestPractices: "Best Practices",
  projectSummaries: "Project Summaries",
  tutorials: "Tutorials",
  documentation: "Documentation",
  guidelines: "Guidelines",
  api: "API Reference",
  troubleshooting: "Troubleshooting",
  faq: "FAQ",
  architecture: "Architecture",
}

const translations: Record<Language, any> = {
  en: ({
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      projects: "Projects",
      aiTools: "AI Tools",
      community: "Community",
      settings: "Settings",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      todo: "To Do",
      meeting: "Meeting",
      planning: "Planning",
      diagrams: "Flow & Diagrams",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      name: "Name",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      signInButton: "Sign In",
      signUpButton: "Sign Up",
      rememberMe: "Remember me",
    },
    dashboard: {
      welcomeBack: "Welcome back",
      happeningToday: "Here's what's happening with your projects today.",
      loading: "Loading...",
      activeUsers: "Active Users",
      totalBuilds: "Total Builds",
      repositories: "Repositories",
      apiCalls: "API Calls",
      recentProjects: "Recent Projects",
      aiAssistant: "AI Assistant",
      systemStatus: "System Status",
      askAnything: "Ask me anything...",
      send: "Send",
      allSystemsOperational: "All systems operational",
      buildsInProgress: "builds in progress",
      connectedAndHealthy: "Connected and healthy",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your account and preferences",
      profile: "Profile",
      username: "Username",
      email: "Email",
      userId: "User ID",
      memberSince: "Member Since",
      saveChanges: "Save Changes",
      notifications: "Notifications",
      emailNotifications: "Email Notifications",
      emailNotificationsDesc: "Receive updates about your projects",
      buildNotifications: "Build Notifications",
      buildNotificationsDesc: "Get notified when builds complete",
      meetingNotifications: "Meeting Notifications",
      meetingNotificationsDesc: "Get notified about upcoming meetings",
      security: "Security",
      currentPassword: "Current Password",
      newPassword: "New Password",
      updatePassword: "Update Password",
      appearance: "Appearance",
      theme: "Theme",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      currentTheme: "Current theme",
      comingSoon: "Coming soon",
      language: "Language",
      selectLanguage: "Select your preferred language",
      dangerZone: "Danger Zone",
      dangerZoneDesc: "Irreversible actions that will permanently affect your account",
      deleteAccount: "Delete Account",
      avatar: "Profile Picture",
      uploadAvatar: "Upload Photo",
      removeAvatar: "Remove",
      bio: "Bio",
    },
    notifications: {
      title: "Notifications",
      noUpcoming: "No upcoming meetings",
      startsIn: "Starts in",
    },
    landing: {
      hero: {
        title: "Think. Code. Test. Ship.",
        subtitle: "The ultimate platform for developers who build, learn, and collaborate.",
        cta: "Enter Lab68",
        badge: "Next-Gen Collaboration Platform",
      },
      stats: {
        features: "Features",
        openSource: "Open Source",
        available: "Available",
      },
      mission: {
        title: "Our Mission",
        description: "Lab68 is a developer platform designed for those who value function over form. We provide the tools, community, and resources you need to build exceptional software.",
      },
      techStack: {
        title: "Tech Stack",
        description: "Built with modern, production-ready technologies for performance, scalability, and privacy",
        poweredBy: "Powered By",
      },
      services: {
        title: "Our Services",
        subtitle: "Everything you need to build, collaborate, and ship amazing projects",
        badge: "Comprehensive Features",
        learnMore: "Learn more",
        projectManagement: "Jira-like Project Management",
        projectManagementDesc: "Full-featured project management with Kanban boards, sprint planning, backlog management, epic hierarchy, advanced filters, and real-time collaboration.",
        aiAssistant: "AI-Powered Assistant",
        aiAssistantDesc: "Integrated AI assistant for code generation, smart suggestions, task automation, and intelligent workflows. Boost productivity with cutting-edge AI.",
        collaboration: "Real-Time Collaboration",
        collaborationDesc: "Live chat with typing indicators, threaded comments with @mentions, collaborative whiteboard, and real-time updates. Work together seamlessly.",
        fileManagement: "File Management",
        fileManagementDesc: "Upload, organize, and share files effortlessly. Support for multiple file types with easy categorization and search.",
        diagrams: "Diagram & Visualization",
        diagramsDesc: "Create flowcharts, mind maps, and technical diagrams. Visualize your ideas with powerful drawing tools.",
        resumeEditor: "Live Resume Editor",
        resumeEditorDesc: "Professional WYSIWYG resume builder with 5 templates, live A4 preview, drag-and-drop sections, and color customization. Export-ready for PDF.",
        gamesHub: "Games Hub",
        gamesHubDesc: "Take a break with puzzle games, arcade classics, and brain training. Sudoku, Tetris, Snake, typing tests, and more.",
        wiki: "Wiki & Documentation",
        wikiDesc: "Build comprehensive knowledge bases and documentation. Organize information with categories and powerful search.",
        meetingPlanning: "Meeting & Planning",
        meetingPlanningDesc: "Schedule meetings, set milestones, and track progress. Keep your team aligned with clear timelines.",
        liveSupport: "Live Support",
        liveSupportDesc: "Get help when you need it with our integrated live chat support system. Fast, friendly, and always available.",
      },
      community: {
        title: "Join the Community",
        description: "Connect with developers worldwide. Share knowledge. Build together.",
        stayUpdated: "Stay updated with our latest developments:",
        subscribe: "Subscribe",
        visitGithub: "Visit our GitHub",
      },
      whyChoose: {
        title: "Why Choose Lab68?",
        subtitle: "Built by developers, for developers. Experience the difference.",
        fast: "Lightning Fast",
        fastDesc: "Built on Next.js with optimized performance. Real-time updates and instant page loads for seamless workflow.",
        secure: "Secure & Reliable",
        secureDesc: "Enterprise-grade security with JWT authentication, bcrypt encryption, and role-based access control.",
        allInOne: "All-in-One Platform",
        allInOneDesc: "Everything you need in one place. No more switching between multiple tools and losing your flow.",
        ctaTitle: "Ready to Transform Your Workflow?",
        ctaSubtitle: "Join the Lab68 community and experience the future of collaborative development.",
        getStartedFree: "Get Started Free",
        exploreFeatures: "Explore Features",
      },
      team: {
        title: "Meet the Team",
        subtitle: "Dedicated to building powerful tools for developers and teams",
        founder: "Founder & Lead Developer",
        coFounder: "Co-Founder & Assistant",
        developer: "Full-stack Developer",
        viewRepo: "View Project Repository",
      },
      sponsor: {
        title: "Sponsor the Project",
        subtitle: "Help us continue building and maintaining this open-source platform. Your support means the world to us!",
        badge: "Support Our Work",
        buyMeCoffee: "Buy Me a Coffee",
        buyMeCoffeeDesc: "Support us with a one-time donation",
        githubSponsors: "GitHub Sponsors",
        githubSponsorsDesc: "Become a monthly sponsor and help sustain us",
      },
    },
    todo: {
      title: "To Do",
      subtitle: "Manage your tasks and stay organized",
      addTask: "Add Task",
      taskName: "Task Name",
      taskDescription: "Task Description",
      priority: "Priority",
      low: "Low",
      medium: "Medium",
      high: "High",
      create: "Create Task",
      noTasks: "No tasks yet",
      startAdding: "Start adding tasks to stay organized",
      completed: "Completed",
      pending: "Pending",
      markComplete: "Mark Complete",
      markIncomplete: "Mark Incomplete",
      delete: "Delete",
    },
    meeting: {
      title: "Meeting",
      subtitle: "Schedule and manage your meetings",
      scheduleMeeting: "Schedule Meeting",
      meetingTitle: "Meeting Title",
      meetingDescription: "Meeting Description",
      date: "Date",
      time: "Time",
      duration: "Duration",
      minutes: "minutes",
      schedule: "Schedule Meeting",
      noMeetings: "No meetings scheduled",
      startScheduling: "Start scheduling meetings to stay organized",
      upcoming: "Upcoming",
      past: "Past",
      cancel: "Cancel Meeting",
    },
    planning: {
      title: "Planning",
      subtitle: "Plan and track your projects",
      createPlan: "Create Plan",
      planName: "Plan Name",
      planDescription: "Plan Description",
      startDate: "Start Date",
      endDate: "End Date",
      status: "Status",
      notStarted: "Not Started",
      inProgress: "In Progress",
      completed: "Completed",
      create: "Create Plan",
      noPlans: "No plans yet",
      startPlanning: "Start planning your projects",
      addMilestone: "Add Milestone",
      milestoneName: "Milestone Name",
      milestoneDate: "Milestone Date",
      delete: "Delete",
    },
    projects: {
      title: "Projects",
      subtitle: "Manage and monitor your development projects",
      newProject: "New Project",
      projectName: "Project Name",
      projectDescription: "Project Description",
      technologies: "Technologies (comma separated)",
      status: "Status",
      active: "Active",
      building: "Building",
      inProgress: "In Progress",
      create: "Create Project",
      noProjects: "No projects yet",
      startCreating: "Start creating projects to track your work",
      lastUpdated: "Last updated",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save Changes",
      editProject: "Edit Project",
      kanban: "Kanban Board",
      viewKanban: "View Kanban",
      collaborators: "Collaborators",
      addCollaborator: "Add Collaborator",
      inviteByEmail: "Invite by email",
      invite: "Invite",
      removeCollaborator: "Remove",
      owner: "Owner",
      noCollaborators: "No collaborators yet",
      role: "Role",
      selectRole: "Select role",
      roleOwner: "Owner",
      roleAdmin: "Admin",
      roleEditor: "Editor",
      roleViewer: "Viewer",
      permissions: "Permissions",
      canEdit: "Can edit",
      canDelete: "Can delete",
      canInvite: "Can invite",
      canManageRoles: "Can manage roles",
      canViewActivity: "Can view activity",
      activity: "Activity",
      recentActivity: "Recent Activity",
      noActivity: "No recent activity",
      lastActive: "Last active",
      addedBy: "Added by",
      changeRole: "Change Role",
      member: "member",
      members: "members",
    },
    community: {
      title: "Community",
      subtitle: "Connect with developers, share knowledge, and collaborate",
      newDiscussion: "New Discussion",
      discussionTitle: "Discussion Title",
      discussionContent: "What's on your mind?",
      category: "Category",
      selectCategory: "Select a category",
      customCategory: "Custom Category Name",
      post: "Post Discussion",
      noDiscussions: "No discussions yet",
      startDiscussion: "Be the first to start a discussion",
      replies: "replies",
      by: "by",
      cancel: "Cancel",
      general: "General",
      help: "Help",
      showcase: "Showcase",
      feedback: "Feedback",
      announcements: "Announcements",
    },
    kanban: {
      title: "Kanban Board",
      backToProjects: "Back to Projects",
      addCard: "Add Card",
      addColumn: "Add Column",
      columnName: "Column Name",
      cardTitle: "Card Title",
      cardDescription: "Card Description",
      assignee: "Assignee",
      dueDate: "Due Date",
      create: "Create",
      cancel: "Cancel",
      deleteCard: "Delete Card",
      deleteColumn: "Delete Column",
      editCard: "Edit Card",
      save: "Save Changes",
      noCards: "No cards yet",
      dragCard: "Drag cards between columns",
    },
    diagrams: {
      title: "Flow & Diagrams",
      createNew: "Create New Diagram",
      noDiagrams: "No diagrams yet",
      noDiagramsDesc: "Create your first flowchart or diagram to visualize your processes",
      diagramName: "Diagram Name",
      description: "Description",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this diagram?",
      cancel: "Cancel",
      save: "Save",
      addNode: "Add Node",
      addConnection: "Add Connection",
      nodeTypes: {
        start: "Start",
        process: "Process",
        decision: "Decision",
        end: "End",
        data: "Data",
        document: "Document",
        cloud: "Cloud",
        hexagon: "Hexagon",
        parallelogram: "Parallelogram",
        text: "Text",
      },
      tools: {
        select: "Select",
        move: "Move",
        delete: "Delete",
        connect: "Connect",
      },
      exportImage: "Export as Image",
      exportJSON: "Export as JSON",
      clear: "Clear Canvas",
      zoom: "Zoom",
      saved: "Diagram saved successfully!",
      editLabel: "Edit Label"
    },
    chat: {
      title: "Chat & Messaging",
      newChat: "New Chat",
      newGroup: "New Group",
      searchMessages: "Search messages...",
      typeMessage: "Type a message...",
      send: "Send",
      edit: "Edit",
      delete: "Delete",
      reply: "Reply",
      react: "React",
      copyText: "Copy Text",
      noMessages: "No messages yet",
      startConversation: "Start the conversation",
      typing: "typing...",
      isTyping: "is typing...",
      areTyping: "are typing...",
      online: "Online",
      offline: "Offline",
      lastSeen: "Last seen",
      readBy: "Read by",
      unread: "Unread",
      markAsRead: "Mark as Read",
      createRoom: "Create Chat Room",
      roomName: "Room Name",
      addMembers: "Add Members",
      directMessage: "Direct Message",
      groupChat: "Group Chat",
      projectChat: "Project Chat",
      members: "Members",
      leaveChat: "Leave Chat",
      deleteChat: "Delete Chat",
      confirmDelete: "Are you sure you want to delete this chat?",
      cancel: "Cancel",
      edited: "(edited)",
      uploadFile: "Upload File",
      attachFile: "Attach File",
      sendingFile: "Sending file...",
      fileUploaded: "File uploaded",
      fileTooLarge: "File is too large",
      maxFileSize: "Maximum file size is 10MB",
      selectEmoji: "Select emoji",
    },
    comments: {
      title: "Comments",
      addComment: "Add Comment",
      typeComment: "Type your comment...",
      post: "Post",
      edit: "Edit",
      delete: "Delete",
      reply: "Reply",
      resolve: "Resolve",
      resolved: "Resolved",
      unresolve: "Unresolve",
      noComments: "No comments yet",
      startDiscussion: "Start the discussion by adding a comment",
      mention: "Mention",
      mentionSomeone: "Type @ to mention someone",
      showResolved: "Show Resolved",
      hideResolved: "Hide Resolved",
      sortBy: "Sort by",
      newest: "Newest First",
      oldest: "Oldest First",
      mostReplies: "Most Replies",
      cancel: "Cancel",
      save: "Save",
      confirmDelete: "Are you sure you want to delete this comment?",
      edited: "(edited)",
      replying: "Replying",
      replyingTo: "Replying to",
      viewReplies: "View Replies",
      hideReplies: "Hide Replies",
      replies: "Replies",
      react: "React",
      reactions: "Reactions",
      mentionedYou: "mentioned you",
      inComment: "in a comment",
      onTask: "on task",
      onDiagram: "on diagram",
      onProject: "on project",
      onFile: "on file",
    },
    whiteboard: {
      title: "Whiteboard",
      newWhiteboard: "New Whiteboard",
      whiteboardName: "Whiteboard Name",
      description: "Description",
      create: "Create",
      open: "Open",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this whiteboard?",
      noWhiteboards: "No whiteboards yet",
      startDrawing: "Create your first whiteboard to start drawing",
      save: "Save",
      export: "Export",
      exportPNG: "Export as PNG",
      exportSVG: "Export as SVG",
      tools: "Tools",
      pen: "Pen",
      line: "Line",
      rectangle: "Rectangle",
      circle: "Circle",
      ellipse: "Ellipse",
      text: "Text",
      eraser: "Eraser",
      select: "Select",
      color: "Color",
      customColor: "Custom Color",
      strokeWidth: "Stroke Width",
      fillShape: "Fill Shape",
      fillColor: "Fill Color",
      fontSize: "Font Size",
      undo: "Undo",
      redo: "Redo",
      clearAll: "Clear All",
      confirmClear: "Clear the entire whiteboard?",
      elements: "elements",
      collaborators: "collaborator(s)",
      updated: "Updated",
      backToWhiteboards: "Back to Whiteboards",
      enterText: "Enter text:",
      saved: "Whiteboard saved!",
    },
    files: {
      title: "Files & Documents",
      subtitle: "Store, share, and manage project files and links",
      uploadFile: "Upload File",
      addLink: "Add Link",
      fileName: "File Name",
      fileDescription: "Description",
      fileUrl: "File URL",
      linkUrl: "Link URL",
      linkTitle: "Link Title",
      linkDescription: "Link Description",
      upload: "Upload",
      addLinkButton: "Add Link",
      cancel: "Cancel",
      noFiles: "No files or links yet",
      startUploading: "Upload your first file or add a link to get started",
      uploadedBy: "Uploaded by",
      linkedBy: "Added by",
      delete: "Delete",
      download: "Download",
      openLink: "Open Link",
      type: "Type",
      uploaded: "Uploaded",
      linked: "Link",
      relatedTo: "Related To",
      project: "Project",
      task: "Task",
      meeting: "Meeting",
      design: "Design",
      documentation: "Documentation",
      planning: "Planning",
      research: "Research",
      general: "General",
      architecture: "Architecture",
    },
    wiki: {
      title: "Knowledge Base",
      subtitle: "Document processes, best practices, and project summaries",
      createArticle: "Create Article",
      articleTitle: "Article Title",
      articleContent: "Content",
      category: "Category",
      tags: "Tags",
      tagsPlaceholder: "Add tags separated by commas",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      noArticles: "No articles yet",
      startWriting: "Create your first article to start building your knowledge base",
      lastUpdated: "Last updated",
      author: "Author",
      readMore: "Read More",
      backToList: "Back to Articles",
      confirmDelete: "Are you sure you want to delete this article?",
      processes: "Processes",
      bestPractices: "Best Practices",
      projectSummaries: "Project Summaries",
      tutorials: "Tutorials",
      documentation: "Documentation",
      guidelines: "Guidelines",
      api: "API Reference",
      troubleshooting: "Troubleshooting",
      faq: "FAQ",
      architecture: "Architecture",
    },
  }) as Translations,
  vi: {
    nav: {
      home: "Trang Ch?",
      dashboard: "B?ng �i?u Khi?n",
      projects: "D? �n",
      aiTools: "C�ng c? AI",
      community: "C?ng d?ng",
      settings: "C�i �?t",
      signIn: "�ang Nh?p",
      signUp: "�ang K�",
      signOut: "�ang Xu?t",
      todo: "Vi?c c?n l�m",
      meeting: "Cu?c h?p",
      planning: "L?p k? ho?ch",
      diagrams: "So d?",
    },
    auth: {
      signIn: "�ang Nh?p",
      signUp: "�ang K�",
      email: "Email",
      password: "M?t kh?u",
      name: "T�n",
      createAccount: "T?o t�i kho?n",
      alreadyHaveAccount: "�� c� t�i kho?n?",
      dontHaveAccount: "Chua c� t�i kho?n?",
      signInButton: "�ang Nh?p",
      signUpButton: "�ang K�",
      rememberMe: "Ghi nh? t�i",
    },
    dashboard: {
      welcomeBack: "Ch�o m?ng tr? l?i",
      happeningToday: "��y l� nh?ng g� dang x?y ra v?i c�c d? �n c?a b?n h�m nay",
      loading: "�ang t?i...",
      activeUsers: "Ngu?i d�ng Ho?t d?ng",
      totalBuilds: "T?ng s? B?n d?ng",
      repositories: "Kho luu tr?",
      apiCalls: "Lu?t g?i API",
      recentProjects: "D? �n G?n d�y",
      aiAssistant: "Tr? l� AI",
      systemStatus: "Tr?ng th�i H? th?ng",
      askAnything: "H?i t�i b?t c? di?u g�...",
      send: "G?i",
      allSystemsOperational: "T?t c? h? th?ng ho?t d?ng",
      buildsInProgress: "b?n d?ng dang ti?n h�nh",
      connectedAndHealthy: "�� k?t n?i v� kh?e m?nh",
    },
    settings: {
      title: "C�i �?t",
      subtitle: "Qu?n l� c�i d?t t�i kho?n v� t�y ch?n c?a b?n",
      profile: "H? so",
      username: "T�n ngu?i d�ng",
      email: "Email",
      bio: "Ti?u s?",
      bioPlaceholder: "K? ch�ng t�i nghe v? b?n...",
      avatar: "?nh d?i di?n",
      uploadAvatar: "T?i l�n ?nh d?i di?n",
      removeAvatar: "X�a ?nh d?i di?n",
      notifications: "Th�ng b�o",
      emailNotifications: "Th�ng b�o Email",
      emailNotificationsDesc: "Nh?n c?p nh?t v? d? �n c?a b?n",
      buildNotifications: "Th�ng b�o B?n d?ng",
      buildNotificationsDesc: "Th�ng b�o khi b?n d?ng ho�n th�nh",
      meetingNotifications: "Th�ng b�o Cu?c h?p",
      meetingNotificationsDesc: "Nh?c nh? v? c�c cu?c h?p s?p t?i",
      language: "Ng�n ng?",
      selectLanguage: "Ch?n ng�n ng? ua th�ch c?a b?n",
      theme: "Ch? d?",
      lightMode: "S�ng",
      darkMode: "T?i",
      privacy: "Quy?n ri�ng tu",
      showEmail: "Hi?n th? email c�ng khai",
      showActivity: "Hi?n th? ho?t d?ng",
      showProfile: "�?t h? so c�ng khai",
      security: "B?o m?t",
      changePassword: "�?i m?t kh?u",
      currentPassword: "M?t kh?u hi?n t?i",
      newPassword: "M?t kh?u m?i",
      confirmPassword: "X�c nh?n m?t kh?u",
      updatePassword: "C?p nh?t M?t kh?u",
      twoFactor: "X�c th?c hai y?u t?",
      enable2FA: "B?t 2FA",
      saveChanges: "Luu thay d?i",
      cancel: "H?y",
    },
    landing: {
      hero: {
        title: "Suy nghi. M� h�a. Ki?m tra. Tri?n khai.",
        subtitle: "N?n t?ng t?i uu cho c�c nh� ph�t tri?n d? x�y d?ng, h?c t?p v� c?ng t�c.",
        cta: "V�o Lab68",
        badge: "N?n t?ng C?ng t�c Th? h? M?i",
      },
      stats: {
        features: "T�nh nang",
        openSource: "M� ngu?n m?",
        available: "Kh? d?ng",
      },
      mission: {
        title: "S? m?nh c?a ch�ng t�i",
        description: "Lab68 l� n?n t?ng ph�t tri?n du?c thi?t k? cho nh?ng ai d? cao t�nh nang. Ch�ng t�i cung c?p c�ng c?, c?ng d?ng v� t�i nguy�n b?n c?n d? x�y d?ng ph?n m?m xu?t s?c.",
      },
      techStack: {
        title: "C�ng ngh? s? d?ng",
        description: "�u?c x�y d?ng v?i c�ng ngh? hi?n d?i, s?n s�ng s?n xu?t cho hi?u su?t, kh? nang m? r?ng v� b?o m?t",
        poweredBy: "�u?c h? tr? b?i",
      },
      services: {
        title: "D?ch v? c?a ch�ng t�i",
        subtitle: "M?i th? b?n c?n d? x�y d?ng, c?ng t�c v� tri?n khai c�c d? �n tuy?t v?i",
        badge: "T�nh nang to�n di?n",
        learnMore: "T�m hi?u th�m",
        projectManagement: "Qu?n l� d? �n ki?u Jira",
        projectManagementDesc: "Qu?n l� d? �n d?y d? t�nh nang v?i b?ng Kanban, l?p k? ho?ch sprint, qu?n l� backlog, ph�n c?p epic, b? l?c n�ng cao v� c?ng t�c th?i gian th?c.",
        aiAssistant: "Tr? l� AI",
        aiAssistantDesc: "Tr? l� AI t�ch h?p d? t?o code, g?i � th�ng minh, t? d?ng h�a t�c v? v� quy tr�nh l�m vi?c th�ng minh. Tang nang su?t v?i AI ti�n ti?n.",
        collaboration: "C?ng t�c Th?i gian Th?c",
        collaborationDesc: "Chat tr?c ti?p v?i ch? b�o dang nh?p, b�nh lu?n theo chu?i v?i @mentions, b?ng tr?ng c?ng t�c v� c?p nh?t th?i gian th?c. L�m vi?c c�ng nhau li?n m?ch.",
        fileManagement: "Qu?n l� T?p",
        fileManagementDesc: "T?i l�n, s?p x?p v� chia s? t?p d? d�ng. H? tr? nhi?u lo?i t?p v?i ph�n lo?i v� t�m ki?m d? d�ng.",
        diagrams: "So d? & Tr?c quan h�a",
        diagramsDesc: "T?o so d? lu?ng, b?n d? tu duy v� so d? k? thu?t. H�nh dung � tu?ng c?a b?n v?i c�ng c? v? m?nh m?.",
        resumeEditor: "Tr�nh so?n CV Tr?c ti?p",
        resumeEditorDesc: "Tr�nh t?o CV WYSIWYG chuy�n nghi?p v?i 5 m?u, xem tru?c A4 tr?c ti?p, k�o th? c�c ph?n v� t�y ch?nh m�u s?c. S?n s�ng xu?t PDF.",
        gamesHub: "Trung t�m Game",
        gamesHubDesc: "Ngh? ngoi v?i c�c tr� choi gi?i d?, arcade c? di?n v� r�n luy?n n�o b?. Sudoku, Tetris, Snake, ki?m tra d�nh m�y v� nhi?u hon n?a.",
        wiki: "Wiki & T�i li?u",
        wikiDesc: "X�y d?ng co s? ki?n th?c v� t�i li?u to�n di?n. T? ch?c th�ng tin v?i danh m?c v� t�m ki?m m?nh m?.",
        meetingPlanning: "Cu?c h?p & L?p k? ho?ch",
        meetingPlanningDesc: "L�n l?ch cu?c h?p, d?t m?c quan tr?ng v� theo d�i ti?n d?. Gi? d?i c?a b?n d?ng b? v?i timeline r� r�ng.",
        liveSupport: "H? tr? Tr?c ti?p",
        liveSupportDesc: "Nh?n tr? gi�p khi b?n c?n v?i h? th?ng h? tr? chat tr?c ti?p t�ch h?p. Nhanh ch�ng, th�n thi?n v� lu�n s?n s�ng.",
      },
      community: {
        title: "Tham gia c?ng d?ng",
        description: "K?t n?i v?i c�c nh� ph�t tri?n tr�n to�n th? gi?i. Chia s? ki?n th?c. C�ng nhau x�y d?ng.",
        stayUpdated: "C?p nh?t nh?ng ph�t tri?n m?i nh?t c?a ch�ng t�i:",
        subscribe: "�ang k�",
        visitGithub: "Truy c?p GitHub c?a ch�ng t�i",
      },
      whyChoose: {
        title: "T?i sao ch?n Lab68?",
        subtitle: "�u?c x�y d?ng b?i nh� ph�t tri?n, cho nh� ph�t tri?n. Tr?i nghi?m s? kh�c bi?t.",
        fast: "Nhanh nhu Ch?p",
        fastDesc: "�u?c x�y d?ng tr�n Next.js v?i hi?u su?t t?i uu. C?p nh?t th?i gian th?c v� t?i trang t?c th� cho quy tr�nh l�m vi?c li?n m?ch.",
        secure: "An to�n & ��ng tin c?y",
        secureDesc: "B?o m?t c?p doanh nghi?p v?i x�c th?c JWT, m� h�a bcrypt v� ki?m so�t truy c?p d?a tr�n vai tr�.",
        allInOne: "N?n t?ng T?t c? trong M?t",
        allInOneDesc: "M?i th? b?n c?n ? m?t noi. Kh�ng c�n chuy?n d?i gi?a nhi?u c�ng c? v� m?t flow.",
        ctaTitle: "S?n s�ng Chuy?n d?i Quy tr�nh l�m vi?c?",
        ctaSubtitle: "Tham gia c?ng d?ng Lab68 v� tr?i nghi?m tuong lai c?a ph�t tri?n c?ng t�c.",
        getStartedFree: "B?t d?u Mi?n ph�",
        exploreFeatures: "Kh�m ph� T�nh nang",
      },
      team: {
        title: "G?p g? �?i ngu",
        subtitle: "T?n t�m x�y d?ng c�ng c? m?nh m? cho nh� ph�t tri?n v� d?i nh�m",
        founder: "Nh� s�ng l?p & Tru?ng nh�m Ph�t tri?n",
        coFounder: "�?ng s�ng l?p & Tr? l�",
        developer: "Nh� ph�t tri?n Full-stack",
        viewRepo: "Xem Kho m� ngu?n",
      },
      sponsor: {
        title: "T�i tr? D? �n",
        subtitle: "Gi�p ch�ng t�i ti?p t?c x�y d?ng v� duy tr� n?n t?ng m� ngu?n m? n�y. S? h? tr? c?a b?n c� � nghia r?t l?n!",
        badge: "?ng h? C�ng vi?c c?a ch�ng t�i",
        buyMeCoffee: "Mua cho t�i m?t ly C� ph�",
        buyMeCoffeeDesc: "?ng h? ch�ng t�i v?i m?t l?n quy�n g�p",
        githubSponsors: "GitHub Sponsors",
        githubSponsorsDesc: "Tr? th�nh nh� t�i tr? h�ng th�ng v� gi�p duy tr� ch�ng t�i",
      },
    },
    todo: {
      title: "Vi?c c?n l�m",
      subtitle: "Qu?n l� c�ng vi?c v� lu�n c� t? ch?c",
      addTask: "Th�m nhi?m v?",
      taskName: "T�n nhi?m v?",
      taskDescription: "M� t? nhi?m v?",
      priority: "Uu ti�n",
      low: "Th?p",
      medium: "Trung b�nh",
      high: "Cao",
      create: "T?o nhi?m v?",
      noTasks: "Chua c� nhi?m v? n�o",
      startAdding: "B?t d?u th�m nhi?m v? d? lu�n c� t? ch?c",
      completed: "Ho�n th�nh",
      pending: "�ang ch?",
      markComplete: "��nh d?u ho�n th�nh",
      markIncomplete: "��nh d?u chua ho�n th�nh",
      delete: "X�a",
    },
    meeting: {
      title: "Cu?c h?p",
      subtitle: "L�n l?ch v� qu?n l� c�c cu?c h?p c?a b?n",
      scheduleMeeting: "L�n l?ch h?p",
      meetingTitle: "Ti�u d? cu?c h?p",
      meetingDescription: "M� t? cu?c h?p",
      date: "Ng�y",
      time: "Th?i gian",
      duration: "Th?i lu?ng",
      minutes: "ph�t",
      schedule: "L�n l?ch h?p",
      noMeetings: "Chua c� cu?c h?p n�o",
      startScheduling: "B?t d?u l�n l?ch c�c cu?c h?p d? lu�n c� t? ch?c",
      upcoming: "S?p t?i",
      past: "�� qua",
      cancel: "H?y cu?c h?p",
    },
    planning: {
      title: "L?p k? ho?ch",
      subtitle: "L?p k? ho?ch v� theo d�i d? �n c?a b?n",
      createPlan: "T?o k? ho?ch",
      planName: "T�n k? ho?ch",
      planDescription: "M� t? k? ho?ch",
      startDate: "Ng�y b?t d?u",
      endDate: "Ng�y k?t th�c",
      status: "Tr?ng th�i",
      notStarted: "Chua b?t d?u",
      inProgress: "�ang ti?n h�nh",
      completed: "Ho�n th�nh",
      create: "T?o k? ho?ch",
      noPlans: "Chua c� k? ho?ch n�o",
      startPlanning: "B?t d?u l?p k? ho?ch cho d? �n c?a b?n",
      addMilestone: "Th�m m?c quan tr?ng",
      milestoneName: "T�n m?c quan tr?ng",
      milestoneDate: "Ng�y m?c quan tr?ng",
      delete: "X�a",
    },
    notifications: {
      title: "Th�ng b�o",
      noUpcoming: "Kh�ng c� cu?c h?p s?p t?i",
      startsIn: "B?t d?u trong",
    },
    projects: {
      title: "D? �n",
      subtitle: "Qu?n l� v� gi�m s�t c�c d? �n ph�t tri?n c?a b?n",
      newProject: "D? �n m?i",
      projectName: "T�n d? �n",
      projectDescription: "M� t? d? �n",
      technologies: "C�ng ngh? (ph�n t�ch b?ng d?u ph?y)",
      status: "Tr?ng th�i",
      active: "Ho?t d?ng",
      building: "�ang x�y d?ng",
      inProgress: "�ang ti?n h�nh",
      create: "T?o d? �n",
      noProjects: "Chua c� d? �n n�o",
      startCreating: "B?t d?u t?o d? �n d? theo d�i c�ng vi?c c?a b?n",
      lastUpdated: "C?p nh?t l?n cu?i",
      edit: "Ch?nh s?a",
      delete: "X�a",
      cancel: "H?y",
      save: "Luu thay d?i",
      editProject: "Ch?nh s?a d? �n",
      kanban: "B?ng Kanban",
      viewKanban: "Xem Kanban",
      collaborators: "C?ng t�c vi�n",
      addCollaborator: "Th�m c?ng t�c vi�n",
      inviteByEmail: "M?i qua email",
      invite: "M?i",
      removeCollaborator: "X�a",
      owner: "Ch? s? h?u",
      noCollaborators: "Chua c� c?ng t�c vi�n",
      role: "Vai tr�",
      selectRole: "Ch?n vai tr�",
      roleOwner: "Ch? s? h?u",
      roleAdmin: "Qu?n tr? vi�n",
      roleEditor: "Bi�n t?p vi�n",
      roleViewer: "Ngu?i xem",
      permissions: "Quy?n h?n",
      canEdit: "C� th? ch?nh s?a",
      canDelete: "C� th? x�a",
      canInvite: "C� th? m?i",
      canManageRoles: "C� th? qu?n l� vai tr�",
      canViewActivity: "C� th? xem ho?t d?ng",
      activity: "Ho?t d?ng",
      recentActivity: "Ho?t �?ng G?n ��y",
      noActivity: "Kh�ng c� ho?t d?ng g?n d�y",
      lastActive: "Ho?t d?ng l?n cu?i",
      addedBy: "�u?c th�m b?i",
      changeRole: "Thay �?i Vai Tr�",
      member: "th�nh vi�n",
      members: "th�nh vi�n",
    },
    community: {
      title: "C?ng d?ng",
      subtitle: "K?t n?i v?i c�c nh� ph�t tri?n, chia s? ki?n th?c v� c?ng t�c",
      newDiscussion: "Th?o lu?n m?i",
      discussionTitle: "Ti�u d? th?o lu?n",
      discussionContent: "B?n dang nghi g�?",
      category: "Danh m?c",
      selectCategory: "Ch?n danh m?c",
      customCategory: "T�n danh m?c t�y ch?nh",
      post: "�ang Th?o Lu?n",
      noDiscussions: "Chua c� th?o lu?n n�o",
      startDiscussion: "H�y l� ngu?i d?u ti�n b?t d?u th?o lu?n",
      replies: "tr? l?i",
      by: "b?i",
      cancel: "H?y",
      general: "Chung",
      help: "Tr? gi�p",
      showcase: "Trung B�y",
      feedback: "Ph?n h?i",
      announcements: "Th�ng b�o",
    },
    kanban: {
      title: "B?ng Kanban",
      backToProjects: "Quay l?i D? �n",
      addCard: "Th�m th?",
      addColumn: "Th�m c?t",
      columnName: "T�n c?t",
      cardTitle: "Ti�u d? th?",
      cardDescription: "M� t? th?",
      assignee: "Ngu?i �u?c Giao",
      dueDate: "H?n ch�t",
      create: "T?o",
      cancel: "H?y",
      deleteCard: "X�a th?",
      deleteColumn: "X�a c?t",
      editCard: "Ch?nh s?a th?",
      save: "Luu",
      noCards: "Chua c� th? n�o",
      dragCard: "K�o th? gi?a c�c c?t",
    },
    diagrams: {
      title: "So d? v� Bi?u d?",
      createNew: "T?o So d? M?i",
      noDiagrams: "Chua c� so d? n�o",
      noDiagramsDesc: "T?o so d? lu?ng ho?c bi?u d? d?u ti�n d? h�nh dung quy tr�nh c?a b?n",
      diagramName: "T�n so d?",
      description: "M� t?",
      create: "T?o",
      edit: "Ch?nh s?a",
      delete: "X�a",
      confirmDelete: "B?n c� ch?c ch?n mu?n x�a so d? n�y kh�ng?",
      cancel: "H?y",
      save: "Luu",
      addNode: "Th�m N�t",
      addConnection: "Th�m K?t n?i",
      nodeTypes: {
        start: "B?t d?u",
        process: "Quy tr�nh",
        decision: "Quy?t d?nh",
        end: "K?t th�c",
        data: "D? li?u",
        document: "T�i li?u",
        cloud: "��m m�y",
        hexagon: "L?c gi�c",
        parallelogram: "H�nh b�nh h�nh",
        text: "Van b?n",
      },
      tools: {
        select: "Ch?n",
        move: "Di chuy?n",
        delete: "X�a",
        connect: "K?t n?i",
      },
      exportImage: "Xu?t du?i d?ng H�nh ?nh",
      exportJSON: "Xu?t du?i d?ng JSON",
      clear: "X�a Canvas",
      zoom: "Thu ph�ng",
      saved: "So d? d� luu th�nh c�ng!",
      editLabel: "Ch?nh s?a nh�n",
    },
    chat: {
      title: "Tr� chuy?n v� Tin nh?n",
      newChat: "Cu?c tr� chuy?n m?i",
      newGroup: "Nh�m m?i",
      searchMessages: "T�m ki?m tin nh?n...",
      typeMessage: "Nh?p tin nh?n...",
      send: "G?i",
      edit: "Ch?nh s?a",
      delete: "X�a",
      reply: "Tr? l?i",
      react: "Ph?n ?ng",
      copyText: "Sao ch�p van b?n",
      noMessages: "Chua c� tin nh?n n�o",
      startConversation: "B?t d?u cu?c tr� chuy?n",
      typing: "dang nh?p...",
      isTyping: "dang nh?p...",
      areTyping: "dang nh?p...",
      online: "tr?c tuy?n",
      offline: "ngo?i tuy?n",
      lastSeen: "L?n cu?i tr?c tuy?n",
      readBy: "�� d?c b?i",
      unread: "Chua d?c",
      markAsRead: "��nh d?u l� d� d?c",
      createRoom: "T?o ph�ng tr� chuy?n",
      roomName: "T�n ph�ng",
      addMembers: "Th�m th�nh vi�n",
      directMessage: "Tin nh?n tr?c ti?p",
      groupChat: "Tr� chuy?n nh�m",
      projectChat: "Tr� chuy?n d? �n",
      members: "Th�nh vi�n",
      leaveChat: "R?i kh?i cu?c tr� chuy?n",
      deleteChat: "X�a cu?c tr� chuy?n",
      confirmDelete: "B?n c� ch?c ch?n mu?n x�a cu?c tr� chuy?n n�y kh�ng?",
      cancel: "H?y",
      edited: "(d� ch?nh s?a)",
      uploadFile: "T?i l�n t?p",
      attachFile: "��nh k�m t?p",
      sendingFile: "�ang g?i t?p...",
      fileUploaded: "T?p d� t?i l�n",
      fileTooLarge: "T?p qu� l?n",
      maxFileSize: "K�ch thu?c t?p t?i da l� 10MB",
      selectEmoji: "Ch?n bi?u tu?ng c?m x�c",
    },
    comments: {
      title: "B�nh lu?n",
      addComment: "Th�m b�nh lu?n",
      typeComment: "Nh?p b�nh lu?n c?a b?n...",
      post: "�ang",
      edit: "Ch?nh s?a",
      delete: "X�a",
      reply: "Tr? l?i",
      resolve: "Gi?i quy?t",
      resolved: "�� gi?i quy?t",
      unresolve: "M? l?i",
      noComments: "Chua c� b�nh lu?n n�o",
      startDiscussion: "B?t d?u th?o lu?n b?ng c�ch th�m b�nh lu?n",
      mention: "�? c?p",
      mentionSomeone: "Nh?p @ d? d? c?p ai d�",
      showResolved: "Hi?n th? d� gi?i quy?t",
      hideResolved: "?n d� gi?i quy?t",
      sortBy: "S?p x?p theo",
      newest: "M?i nh?t tru?c",
      oldest: "Cu nh?t tru?c",
      mostReplies: "Nhi?u tr? l?i nh?t",
      cancel: "H?y",
      save: "Luu",
      confirmDelete: "B?n c� ch?c ch?n mu?n x�a b�nh lu?n n�y kh�ng?",
      edited: "(d� ch?nh s?a)",
      replying: "�ang tr? l?i",
      replyingTo: "Tr? l?i cho",
      viewReplies: "Xem c�u tr? l?i",
      hideReplies: "?n c�u tr? l?i",
      replies: "c�u tr? l?i",
      react: "Ph?n ?ng",
      reactions: "Ph?n ?ng",
      mentionedYou: "d� d? c?p d?n b?n",
      inComment: "trong b�nh lu?n",
      onTask: "tr�n nhi?m v?",
      onDiagram: "tr�n so d?",
      onProject: "tr�n d? �n",
      onFile: "tr�n t?p",
    },
    whiteboard: {
      title: "B?ng tr?ng",
      newWhiteboard: "B?ng tr?ng m?i",
      whiteboardName: "T�n b?ng tr?ng",
      description: "M� t?",
      create: "T?o",
      open: "M?",
      delete: "X�a",
      confirmDelete: "B?n c� ch?c ch?n mu?n x�a b?ng tr?ng n�y kh�ng?",
      noWhiteboards: "Chua c� b?ng tr?ng n�o",
      startDrawing: "T?o b?ng tr?ng d?u ti�n c?a b?n d? b?t d?u v?",
      save: "Luu",
      export: "Xu?t",
      exportPNG: "Xu?t du?i d?ng PNG",
      exportSVG: "Xu?t du?i d?ng SVG",
      tools: "C�ng c?",
      pen: "B�t",
      line: "�u?ng th?ng",
      rectangle: "H�nh ch? nh?t",
      circle: "H�nh tr�n",
      ellipse: "H�nh elip",
      text: "Van b?n",
      eraser: "T?y",
      select: "Ch?n",
      color: "M�u s?c",
      customColor: "M�u t�y ch?nh",
      strokeWidth: "�? d�y n�t",
      fillShape: "T� m�u h�nh",
      fillColor: "M�u t�",
      fontSize: "K�ch thu?c ph�ng ch?",
      undo: "Ho�n t�c",
      redo: "L�m l?i",
      clearAll: "X�a t?t c?",
      confirmClear: "X�a to�n b? b?ng tr?ng?",
      elements: "C�c ph?n t?",
      collaborators: "C?ng t�c vi�n",
      updated: "�� c?p nh?t",
      backToWhiteboards: "Quay l?i B?ng tr?ng",
      enterText: "Nh?p van b?n:",
      saved: "B?ng tr?ng d� luu!",
    },
    files: {
      title: "T?p v� T�i li?u",
      subtitle: "Luu tr?, chia s? v� qu?n l� t?p v� li�n k?t d? �n",
      uploadFile: "T?i l�n t?p",
      addLink: "Th�m li�n k?t",
      fileName: "T�n t?p",
      fileDescription: "M� t?",
      fileUrl: "URL t?p",
      linkUrl: "URL li�n k?t",
      linkTitle: "Ti�u d? li�n k?t",
      linkDescription: "M� t? li�n k?t",
      upload: "T?i l�n",
      addLinkButton: "Th�m li�n k?t",
      cancel: "H?y",
      noFiles: "Chua c� t?p ho?c li�n k?t n�o",
      startUploading: "T?i l�n t?p d?u ti�n ho?c th�m li�n k?t d? b?t d?u",
      uploadedBy: "�u?c t?i l�n b?i",
      linkedBy: "�u?c th�m b?i",
      delete: "X�a",
      download: "T?i xu?ng",
      openLink: "M? li�n k?t",
      type: "Lo?i",
      uploaded: "�� t?i l�n",
      linked: "Li�n k?t",
      relatedTo: "Li�n quan d?n",
      project: "D? �n",
      task: "Nhi?m v?",
      meeting: "Cu?c h?p",
      design: "Thi?t k?",
      documentation: "T�i li?u",
      planning: "L?p k? ho?ch",
      research: "Nghi�n c?u",
      general: "Chung",
      architecture: "Ki?n tr�c",
    },
    wiki: {
      title: "Wiki v� Ki?n th?c",
      subtitle: "Ghi ch�p quy tr�nh, th?c h�nh t?t nh?t v� t�m t?t d? �n",
      createArticle: "T?o b�i vi?t",
      articleTitle: "Ti�u d? b�i vi?t",
      articleContent: "N?i dung",
      category: "Danh m?c",
      tags: "Th?",
      tagsPlaceholder: "Th�m th? c�ch nhau b?ng d?u ph?y",
      create: "T?o",
      edit: "Ch?nh s?a",
      delete: "X�a",
      cancel: "H?y",
      save: "Luu",
      noArticles: "Chua c� b�i vi?t n�o",
      startWriting: "T?o b�i vi?t d?u ti�n c?a b?n d? b?t d?u x�y d?ng co s? ki?n th?c",
      lastUpdated: "C?p nh?t l?n cu?i",
      author: "T�c gi?",
      readMore: "�?c th�m",
      backToList: "Quay l?i b�i vi?t",
      confirmDelete: "B?n c� ch?c ch?n mu?n x�a b�i vi?t n�y kh�ng?",
      processes: "Quy tr�nh",
      bestPractices: "Th?c h�nh t?t nh?t",
      projectSummaries: "T�m t?t d? �n",
      tutorials: "Hu?ng d?n",
      documentation: "T�i li?u",
      guidelines: "Hu?ng d?n",
      api: "Tham kh?o API",
      troubleshooting: "Kh?c ph?c s? c?",
      faq: "C�u h?i thu?ng g?p",
      architecture: "Ki?n tr�c",
    },
  }
};

export function getTranslations(lang: Language): Translations {
  const base = translations.en as Translations
  if (lang === "en") {
    return base
  }

  const overrides = translations[lang]
  if (!overrides || typeof overrides !== "object") {
    return base
  }

  const clone = JSON.parse(JSON.stringify(base)) as Translations

  const merge = (target: Record<string, any>, source: Record<string, any>) => {
    Object.keys(source).forEach((key) => {
      const value = source[key]
      if (value === undefined || value === null) {
        return
      }

      const targetValue = target[key]
      if (
        typeof targetValue === "object" &&
        targetValue !== null &&
        !Array.isArray(targetValue) &&
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        merge(targetValue, value as Record<string, any>)
      } else {
        target[key] = value
      }
    })
  }

  merge(clone as unknown as Record<string, any>, overrides as Record<string, any>)
  return clone
}

export function getLanguageName(lang: Language): string {
  const names: Record<Language, string> = {
    en: "English",
    vi: "Tiếng Việt",
  }
  return names[lang]
}

// Get user's language preference
export function getUserLanguage(): Language {
  if (typeof window === "undefined") return "en"
  const saved = localStorage.getItem("lab68_language")
  return (saved as Language) || "en"
}

// Set user's language preference
export function setUserLanguage(lang: Language): void {
  localStorage.setItem("lab68_language", lang)
}

import { useState, useEffect } from "react"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(getTranslations("en"))

  useEffect(() => {
    const lang = getUserLanguage()
    setLanguage(lang)
    setTranslations(getTranslations(lang))

    // Listen for language changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lab68_language") {
        const newLang = (e.newValue as Language) || "en"
        setLanguage(newLang)
        setTranslations(getTranslations(newLang))
      }
    }

    // Listen for in-window language change events (dispatched by LanguageSwitcher)
    const handleCustomEvent = (e: Event) => {
      try {
        // support CustomEvent with detail
        const ce = e as CustomEvent
        const newLang = (ce?.detail?.lang as Language) || getUserLanguage()
        setLanguage(newLang)
        setTranslations(getTranslations(newLang))
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("lab68_language_change", handleCustomEvent)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("lab68_language_change", handleCustomEvent)
    }
  }, [])

  return {
    language,
    t: translations,
    setLanguage: (lang: Language) => {
      setUserLanguage(lang)
      setLanguage(lang)
      setTranslations(getTranslations(lang))
    },
  }
}








