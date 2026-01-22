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
      home: "Trang Chủ",
      dashboard: "Bảng Điều Khiển",
      projects: "Dự án",
      aiTools: "Công cụ AI",
      community: "Cộng đồng",
      settings: "Cài Đặt",
      signIn: "Đăng Nhập",
      signUp: "Đăng Ký",
      signOut: "Đăng Xuất",
      todo: "Việc cần làm",
      meeting: "Cuộc họp",
      planning: "Lập kế hoạch",
      diagrams: "Sơ đồ",
    },
    auth: {
      signIn: "Đăng Nhập",
      signUp: "Đăng Ký",
      email: "Email",
      password: "Mật khẩu",
      name: "Tên",
      createAccount: "Tạo tài khoản",
      alreadyHaveAccount: "Đã có tài khoản?",
      dontHaveAccount: "Chưa có tài khoản?",
      signInButton: "Đăng Nhập",
      signUpButton: "Đăng Ký",
      rememberMe: "Ghi nhớ tôi",
    },
    dashboard: {
      welcomeBack: "Chào mừng trở lại",
      happeningToday: "Đây là những gì đang xảy ra với các dự án của bạn hôm nay",
      loading: "Đang tải...",
      activeUsers: "Người dùng Hoạt động",
      totalBuilds: "Tổng số Bản dựng",
      repositories: "Kho lưu trữ",
      apiCalls: "Lượt gọi API",
      recentProjects: "Dự án Gần đây",
      aiAssistant: "Trợ lý AI",
      systemStatus: "Trạng thái Hệ thống",
      askAnything: "Hỏi tôi bất cứ điều gì...",
      send: "Gửi",
      allSystemsOperational: "Tất cả hệ thống hoạt động",
      buildsInProgress: "bản dựng đang tiến hành",
      connectedAndHealthy: "Đã kết nối và khỏe mạnh",
    },
    settings: {
      title: "Cài Đặt",
      subtitle: "Quản lý cài đặt tài khoản và tùy chọn của bạn",
      profile: "Hồ sơ",
      username: "Tên người dùng",
      email: "Email",
      bio: "Tiểu sử",
      bioPlaceholder: "Kể chúng tôi nghe về bạn...",
      avatar: "Ảnh đại diện",
      uploadAvatar: "Tải lên Ảnh đại diện",
      removeAvatar: "Xóa Ảnh đại diện",
      notifications: "Thông báo",
      emailNotifications: "Thông báo Email",
      emailNotificationsDesc: "Nhận cập nhật về dự án của bạn",
      buildNotifications: "Thông báo Bản dựng",
      buildNotificationsDesc: "Thông báo khi bản dựng hoàn thành",
      meetingNotifications: "Thông báo Cuộc họp",
      meetingNotificationsDesc: "Nhắc nhở về các cuộc họp sắp tới",
      language: "Ngôn ngữ",
      selectLanguage: "Chọn ngôn ngữ ưa thích của bạn",
      theme: "Chủ đề",
      lightMode: "Sáng",
      darkMode: "Tối",
      privacy: "Quyền riêng tư",
      showEmail: "Hiển thị email công khai",
      showActivity: "Hiển thị hoạt động",
      showProfile: "Đặt hồ sơ công khai",
      security: "Bảo mật",
      changePassword: "Đổi mật khẩu",
      currentPassword: "Mật khẩu hiện tại",
      newPassword: "Mật khẩu mới",
      confirmPassword: "Xác nhận mật khẩu",
      updatePassword: "Cập nhật Mật khẩu",
      twoFactor: "Xác thực hai yếu tố",
      enable2FA: "Bật 2FA",
      saveChanges: "Lưu thay đổi",
      cancel: "Hủy",
    },
    landing: {
      hero: {
        title: "Suy nghĩ. Mã hóa. Kiểm tra. Triển khai.",
        subtitle: "Nền tảng tối ưu cho các nhà phát triển để xây dựng, học tập và cộng tác.",
        cta: "Vào Lab68",
        badge: "Nền tảng Cộng tác Thế hệ Mới",
      },
      stats: {
        features: "Tính năng",
        openSource: "Mã nguồn mở",
        available: "Khả dụng",
      },
      mission: {
        title: "Sứ mệnh của chúng tôi",
        description: "Lab68 là nền tảng phát triển được thiết kế cho những ai đề cao tính năng. Chúng tôi cung cấp công cụ, cộng đồng và tài nguyên bạn cần để xây dựng phần mềm xuất sắc.",
      },
      techStack: {
        title: "Công nghệ sử dụng",
        description: "Được xây dựng với công nghệ hiện đại, sẵn sàng sản xuất cho hiệu suất, khả năng mở rộng và bảo mật",
        poweredBy: "Được hỗ trợ bởi",
      },
      services: {
        title: "Dịch vụ của chúng tôi",
        subtitle: "Mọi thứ bạn cần để xây dựng, cộng tác và triển khai các dự án tuyệt vời",
        badge: "Tính năng toàn diện",
        learnMore: "Tìm hiểu thêm",
        projectManagement: "Quản lý dự án kiểu Jira",
        projectManagementDesc: "Quản lý dự án đầy đủ tính năng với bảng Kanban, lập kế hoạch sprint, quản lý backlog, phân cấp epic, bộ lọc nâng cao và cộng tác thời gian thực.",
        aiAssistant: "Trợ lý AI",
        aiAssistantDesc: "Trợ lý AI tích hợp để tạo code, gợi ý thông minh, tự động hóa tác vụ và quy trình làm việc thông minh. Tăng năng suất với AI tiên tiến.",
        collaboration: "Cộng tác Thời gian Thực",
        collaborationDesc: "Chat trực tiếp với chỉ báo đang nhập, bình luận theo chuỗi với @mentions, bảng trắng cộng tác và cập nhật thời gian thực. Làm việc cùng nhau liền mạch.",
        fileManagement: "Quản lý Tệp",
        fileManagementDesc: "Tải lên, sắp xếp và chia sẻ tệp dễ dàng. Hỗ trợ nhiều loại tệp với phân loại và tìm kiếm dễ dàng.",
        diagrams: "Sơ đồ & Trực quan hóa",
        diagramsDesc: "Tạo sơ đồ luồng, bản đồ tư duy và sơ đồ kỹ thuật. Hình dung ý tưởng của bạn với công cụ vẽ mạnh mẽ.",
        resumeEditor: "Trình soạn CV Trực tiếp",
        resumeEditorDesc: "Trình tạo CV WYSIWYG chuyên nghiệp với 5 mẫu, xem trước A4 trực tiếp, kéo thả các phần và tùy chỉnh màu sắc. Sẵn sàng xuất PDF.",
        gamesHub: "Trung tâm Game",
        gamesHubDesc: "Nghỉ ngơi với các trò chơi giải đố, arcade cổ điển và rèn luyện não bộ. Sudoku, Tetris, Snake, kiểm tra đánh máy và nhiều hơn nữa.",
        wiki: "Wiki & Tài liệu",
        wikiDesc: "Xây dựng cơ sở kiến thức và tài liệu toàn diện. Tổ chức thông tin với danh mục và tìm kiếm mạnh mẽ.",
        meetingPlanning: "Cuộc họp & Lập kế hoạch",
        meetingPlanningDesc: "Lên lịch cuộc họp, đặt mốc quan trọng và theo dõi tiến độ. Giữ đội của bạn đồng bộ với timeline rõ ràng.",
        liveSupport: "Hỗ trợ Trực tiếp",
        liveSupportDesc: "Nhận trợ giúp khi bạn cần với hệ thống hỗ trợ chat trực tiếp tích hợp. Nhanh chóng, thân thiện và luôn sẵn sàng.",
      },
      community: {
        title: "Tham gia cộng đồng",
        description: "Kết nối với các nhà phát triển trên toàn thế giới. Chia sẻ kiến thức. Cùng nhau xây dựng.",
        stayUpdated: "Cập nhật những phát triển mới nhất của chúng tôi:",
        subscribe: "Đăng ký",
        visitGithub: "Truy cập GitHub của chúng tôi",
      },
      whyChoose: {
        title: "Tại sao chọn Lab68?",
        subtitle: "Được xây dựng bởi nhà phát triển, cho nhà phát triển. Trải nghiệm sự khác biệt.",
        fast: "Nhanh như Chớp",
        fastDesc: "Được xây dựng trên Next.js với hiệu suất tối ưu. Cập nhật thời gian thực và tải trang tức thì cho quy trình làm việc liền mạch.",
        secure: "An toàn & Đáng tin cậy",
        secureDesc: "Bảo mật cấp doanh nghiệp với xác thực JWT, mã hóa bcrypt và kiểm soát truy cập dựa trên vai trò.",
        allInOne: "Nền tảng Tất cả trong Một",
        allInOneDesc: "Mọi thứ bạn cần ở một nơi. Không cần chuyển đổi giữa nhiều công cụ và mất flow.",
        ctaTitle: "Sẵn sàng Chuyển đổi Quy trình làm việc?",
        ctaSubtitle: "Tham gia cộng đồng Lab68 và trải nghiệm tương lai của phát triển cộng tác.",
        getStartedFree: "Bắt đầu Miễn phí",
        exploreFeatures: "Khám phá Tính năng",
      },
      team: {
        title: "Gặp gỡ Đội ngũ",
        subtitle: "Tận tâm xây dựng công cụ mạnh mẽ cho nhà phát triển và đội nhóm",
        founder: "Nhà sáng lập & Trưởng nhóm Phát triển",
        coFounder: "Đồng sáng lập & Trợ lý",
        developer: "Nhà phát triển Full-stack",
        viewRepo: "Xem Kho mã nguồn",
      },
      sponsor: {
        title: "Tài trợ Dự án",
        subtitle: "Giúp chúng tôi tiếp tục xây dựng và duy trì nền tảng mã nguồn mở này. Sự hỗ trợ của bạn có ý nghĩa rất lớn!",
        badge: "Ủng hộ Công việc của chúng tôi",
        buyMeCoffee: "Mua cho tôi một ly Cà phê",
        buyMeCoffeeDesc: "Ủng hộ chúng tôi với một lần quyên góp",
        githubSponsors: "GitHub Sponsors",
        githubSponsorsDesc: "Trở thành nhà tài trợ hàng tháng và giúp duy trì chúng tôi",
      },
    },
    todo: {
      title: "Việc cần làm",
      subtitle: "Quản lý công việc và luôn có tổ chức",
      addTask: "Thêm nhiệm vụ",
      taskName: "Tên nhiệm vụ",
      taskDescription: "Mô tả nhiệm vụ",
      priority: "Ưu tiên",
      low: "Thấp",
      medium: "Trung bình",
      high: "Cao",
      create: "Tạo nhiệm vụ",
      noTasks: "Chưa có nhiệm vụ nào",
      startAdding: "Bắt đầu thêm nhiệm vụ để luôn có tổ chức",
      completed: "Hoàn thành",
      pending: "Đang chờ",
      markComplete: "Đánh dấu hoàn thành",
      markIncomplete: "Đánh dấu chưa hoàn thành",
      delete: "Xóa",
    },
    meeting: {
      title: "Cuộc họp",
      subtitle: "Lên lịch và quản lý các cuộc họp của bạn",
      scheduleMeeting: "Lên lịch họp",
      meetingTitle: "Tiêu đề cuộc họp",
      meetingDescription: "Mô tả cuộc họp",
      date: "Ngày",
      time: "Thời gian",
      duration: "Thời lượng",
      minutes: "phút",
      schedule: "Lên lịch họp",
      noMeetings: "Chưa có cuộc họp nào",
      startScheduling: "Bắt đầu lên lịch các cuộc họp để luôn có tổ chức",
      upcoming: "Sắp tới",
      past: "Đã qua",
      cancel: "Hủy cuộc họp",
    },
    planning: {
      title: "Lập kế hoạch",
      subtitle: "Lập kế hoạch và theo dõi dự án của bạn",
      createPlan: "Tạo kế hoạch",
      planName: "Tên kế hoạch",
      planDescription: "Mô tả kế hoạch",
      startDate: "Ngày bắt đầu",
      endDate: "Ngày kết thúc",
      status: "Trạng thái",
      notStarted: "Chưa bắt đầu",
      inProgress: "Đang tiến hành",
      completed: "Hoàn thành",
      create: "Tạo kế hoạch",
      noPlans: "Chưa có kế hoạch nào",
      startPlanning: "Bắt đầu lập kế hoạch cho dự án của bạn",
      addMilestone: "Thêm mốc quan trọng",
      milestoneName: "Tên mốc quan trọng",
      milestoneDate: "Ngày mốc quan trọng",
      delete: "Xóa",
    },
    notifications: {
      title: "Thông báo",
      noUpcoming: "Không có cuộc họp sắp tới",
      startsIn: "Bắt đầu trong",
    },
    projects: {
      title: "Dự án",
      subtitle: "Quản lý và giám sát các dự án phát triển của bạn",
      newProject: "Dự án mới",
      projectName: "Tên dự án",
      projectDescription: "Mô tả dự án",
      technologies: "Công nghệ (phân tách bằng dấu phẩy)",
      status: "Trạng thái",
      active: "Hoạt động",
      building: "Đang xây dựng",
      inProgress: "Đang tiến hành",
      create: "Tạo dự án",
      noProjects: "Chưa có dự án nào",
      startCreating: "Bắt đầu tạo dự án để theo dõi công việc của bạn",
      lastUpdated: "Cập nhật lần cuối",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      cancel: "Hủy",
      save: "Lưu thay đổi",
      editProject: "Chỉnh sửa dự án",
      kanban: "Bảng Kanban",
      viewKanban: "Xem Kanban",
      collaborators: "Cộng tác viên",
      addCollaborator: "Thêm cộng tác viên",
      inviteByEmail: "Mời qua email",
      invite: "Mời",
      removeCollaborator: "Xóa",
      owner: "Chủ sở hữu",
      noCollaborators: "Chưa có cộng tác viên",
      role: "Vai trò",
      selectRole: "Chọn vai trò",
      roleOwner: "Chủ sở hữu",
      roleAdmin: "Quản trị viên",
      roleEditor: "Biên tập viên",
      roleViewer: "Người xem",
      permissions: "Quyền hạn",
      canEdit: "Có thể chỉnh sửa",
      canDelete: "Có thể xóa",
      canInvite: "Có thể mời",
      canManageRoles: "Có thể quản lý vai trò",
      canViewActivity: "Có thể xem hoạt động",
      activity: "Hoạt động",
      recentActivity: "Hoạt động Gần đây",
      noActivity: "Không có hoạt động gần đây",
      lastActive: "Hoạt động lần cuối",
      addedBy: "Được thêm bởi",
      changeRole: "Thay đổi Vai Trò",
      member: "thành viên",
      members: "thành viên",
    },
    community: {
      title: "Cộng đồng",
      subtitle: "Kết nối với các nhà phát triển, chia sẻ kiến thức và cộng tác",
      newDiscussion: "Thảo luận mới",
      discussionTitle: "Tiêu đề thảo luận",
      discussionContent: "Bạn đang nghĩ gì?",
      category: "Danh mục",
      selectCategory: "Chọn danh mục",
      customCategory: "Tên danh mục tùy chỉnh",
      post: "Đăng Thảo Luận",
      noDiscussions: "Chưa có thảo luận nào",
      startDiscussion: "Hãy là người đầu tiên bắt đầu thảo luận",
      replies: "trả lời",
      by: "bởi",
      cancel: "Hủy",
      general: "Chung",
      help: "Trợ giúp",
      showcase: "Trưng Bày",
      feedback: "Phản hồi",
      announcements: "Thông báo",
    },
    kanban: {
      title: "Bảng Kanban",
      backToProjects: "Quay lại Dự án",
      addCard: "Thêm thẻ",
      addColumn: "Thêm cột",
      columnName: "Tên cột",
      cardTitle: "Tiêu đề thẻ",
      cardDescription: "Mô tả thẻ",
      assignee: "Người Được Giao",
      dueDate: "Hạn chót",
      create: "Tạo",
      cancel: "Hủy",
      deleteCard: "Xóa thẻ",
      deleteColumn: "Xóa cột",
      editCard: "Chỉnh sửa thẻ",
      save: "Lưu",
      noCards: "Chưa có thẻ nào",
      dragCard: "Kéo thẻ giữa các cột",
    },
    diagrams: {
      title: "Sơ đồ và Biểu đồ",
      createNew: "Tạo Sơ đồ Mới",
      noDiagrams: "Chưa có sơ đồ nào",
      noDiagramsDesc: "Tạo sơ đồ luồng hoặc biểu đồ đầu tiên để hình dung quy trình của bạn",
      diagramName: "Tên sơ đồ",
      description: "Mô tả",
      create: "Tạo",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      confirmDelete: "Bạn có chắc chắn muốn xóa sơ đồ này không?",
      cancel: "Hủy",
      save: "Lưu",
      addNode: "Thêm Nút",
      addConnection: "Thêm Kết nối",
      nodeTypes: {
        start: "Bắt đầu",
        process: "Quy trình",
        decision: "Quyết định",
        end: "Kết thúc",
        data: "Dữ liệu",
        document: "Tài liệu",
        cloud: "Đám mây",
        hexagon: "Lục giác",
        parallelogram: "Hình bình hành",
        text: "Văn bản",
      },
      tools: {
        select: "Chọn",
        move: "Di chuyển",
        delete: "Xóa",
        connect: "Kết nối",
      },
      exportImage: "Xuất dưới dạng Hình ảnh",
      exportJSON: "Xuất dưới dạng JSON",
      clear: "Xóa Canvas",
      zoom: "Thu phóng",
      saved: "Sơ đồ đã lưu thành công!",
      editLabel: "Chỉnh sửa nhãn",
    },
    chat: {
      title: "Trò chuyện và Tin nhắn",
      newChat: "Cuộc trò chuyện mới",
      newGroup: "Nhóm mới",
      searchMessages: "Tìm kiếm tin nhắn...",
      typeMessage: "Nhập tin nhắn...",
      send: "Gửi",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      reply: "Trả lời",
      react: "Phản ứng",
      copyText: "Sao chép văn bản",
      noMessages: "Chưa có tin nhắn nào",
      startConversation: "Bắt đầu cuộc trò chuyện",
      typing: "đang nhập...",
      isTyping: "đang nhập...",
      areTyping: "đang nhập...",
      online: "trực tuyến",
      offline: "ngoại tuyến",
      lastSeen: "Lần cuối trực tuyến",
      readBy: "Đã đọc bởi",
      unread: "Chưa đọc",
      markAsRead: "Đánh dấu là đã đọc",
      createRoom: "Tạo phòng trò chuyện",
      roomName: "Tên phòng",
      addMembers: "Thêm thành viên",
      directMessage: "Tin nhắn trực tiếp",
      groupChat: "Trò chuyện nhóm",
      projectChat: "Trò chuyện dự án",
      members: "Thành viên",
      leaveChat: "Rời khỏi cuộc trò chuyện",
      deleteChat: "Xóa cuộc trò chuyện",
      confirmDelete: "Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?",
      cancel: "Hủy",
      edited: "(đã chỉnh sửa)",
      uploadFile: "Tải lên tệp",
      attachFile: "Đính kèm tệp",
      sendingFile: "Đang gửi tệp...",
      fileUploaded: "Tệp đã tải lên",
      fileTooLarge: "Tệp quá lớn",
      maxFileSize: "Kích thước tệp tối đa là 10MB",
      selectEmoji: "Chọn biểu tượng cảm xúc",
    },
    comments: {
      title: "Bình luận",
      addComment: "Thêm bình luận",
      typeComment: "Nhập bình luận của bạn...",
      post: "Đăng",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      reply: "Trả lời",
      resolve: "Giải quyết",
      resolved: "Đã giải quyết",
      unresolve: "Mở lại",
      noComments: "Chưa có bình luận nào",
      startDiscussion: "Bắt đầu thảo luận bằng cách thêm bình luận",
      mention: "Đề cập",
      mentionSomeone: "Nhập @ để đề cập ai đó",
      showResolved: "Hiển thị đã giải quyết",
      hideResolved: "Ẩn đã giải quyết",
      sortBy: "Sắp xếp theo",
      newest: "Mới nhất trước",
      oldest: "Cũ nhất trước",
      mostReplies: "Nhiều trả lời nhất",
      cancel: "Hủy",
      save: "Lưu",
      confirmDelete: "Bạn có chắc chắn muốn xóa bình luận này không?",
      edited: "(đã chỉnh sửa)",
      replying: "Đang trả lời",
      replyingTo: "Trả lời cho",
      viewReplies: "Xem câu trả lời",
      hideReplies: "Ẩn câu trả lời",
      replies: "câu trả lời",
      react: "Phản ứng",
      reactions: "Phản ứng",
      mentionedYou: "đã đề cập đến bạn",
      inComment: "trong bình luận",
      onTask: "trên nhiệm vụ",
      onDiagram: "trên sơ đồ",
      onProject: "trên dự án",
      onFile: "trên tệp",
    },
    whiteboard: {
      title: "Bảng trắng",
      newWhiteboard: "Bảng trắng mới",
      whiteboardName: "Tên bảng trắng",
      description: "Mô tả",
      create: "Tạo",
      open: "Mở",
      delete: "Xóa",
      confirmDelete: "Bạn có chắc chắn muốn xóa bảng trắng này không?",
      noWhiteboards: "Chưa có bảng trắng nào",
      startDrawing: "Tạo bảng trắng đầu tiên của bạn để bắt đầu vẽ",
      save: "Lưu",
      export: "Xuất",
      exportPNG: "Xuất dưới dạng PNG",
      exportSVG: "Xuất dưới dạng SVG",
      tools: "Công cụ",
      pen: "Bút",
      line: "Đường thẳng",
      rectangle: "Hình chữ nhật",
      circle: "Hình tròn",
      ellipse: "Hình elip",
      text: "Văn bản",
      eraser: "Tẩy",
      select: "Chọn",
      color: "Màu sắc",
      customColor: "Màu tùy chỉnh",
      strokeWidth: "Độ dày nét",
      fillShape: "Tô màu hình",
      fillColor: "Màu tô",
      fontSize: "Kích thước phông chữ",
      undo: "Hoàn tác",
      redo: "Làm lại",
      clearAll: "Xóa tất cả",
      confirmClear: "Xóa toàn bộ bảng trắng?",
      elements: "Các phần tử",
      collaborators: "Cộng tác viên",
      updated: "Đã cập nhật",
      backToWhiteboards: "Quay lại Bảng trắng",
      enterText: "Nhập văn bản:",
      saved: "Bảng trắng đã lưu!",
    },
    files: {
      title: "Tệp và Tài liệu",
      subtitle: "Lưu trữ, chia sẻ và quản lý tệp và liên kết dự án",
      uploadFile: "Tải lên tệp",
      addLink: "Thêm liên kết",
      fileName: "Tên tệp",
      fileDescription: "Mô tả",
      fileUrl: "URL tệp",
      linkUrl: "URL liên kết",
      linkTitle: "Tiêu đề liên kết",
      linkDescription: "Mô tả liên kết",
      upload: "Tải lên",
      addLinkButton: "Thêm liên kết",
      cancel: "Hủy",
      noFiles: "Chưa có tệp hoặc liên kết nào",
      startUploading: "Tải lên tệp đầu tiên hoặc thêm liên kết để bắt đầu",
      uploadedBy: "Được tải lên bởi",
      linkedBy: "Được thêm bởi",
      delete: "Xóa",
      download: "Tải xuống",
      openLink: "Mở liên kết",
      type: "Loại",
      uploaded: "Đã tải lên",
      linked: "Liên kết",
      relatedTo: "Liên quan đến",
      project: "Dự án",
      task: "Nhiệm vụ",
      meeting: "Cuộc họp",
      design: "Thiết kế",
      documentation: "Tài liệu",
      planning: "Lập kế hoạch",
      research: "Nghiên cứu",
      general: "Chung",
      architecture: "Kiến trúc",
    },
    wiki: {
      title: "Wiki và Kiến thức",
      subtitle: "Ghi chép quy trình, thực hành tốt nhất và tóm tắt dự án",
      createArticle: "Tạo bài viết",
      articleTitle: "Tiêu đề bài viết",
      articleContent: "Nội dung",
      category: "Danh mục",
      tags: "Thẻ",
      tagsPlaceholder: "Thêm thẻ cách nhau bằng dấu phẩy",
      create: "Tạo",
      edit: "Chỉnh sửa",
      delete: "Xóa",
      cancel: "Hủy",
      save: "Lưu",
      noArticles: "Chưa có bài viết nào",
      startWriting: "Tạo bài viết đầu tiên của bạn để bắt đầu xây dựng cơ sở kiến thức",
      lastUpdated: "Cập nhật lần cuối",
      author: "Tác giả",
      readMore: "Đọc thêm",
      backToList: "Quay lại bài viết",
      confirmDelete: "Bạn có chắc chắn muốn xóa bài viết này không?",
      processes: "Quy trình",
      bestPractices: "Thực hành tốt nhất",
      projectSummaries: "Tóm tắt dự án",
      tutorials: "Hướng dẫn",
      documentation: "Tài liệu",
      guidelines: "Hướng dẫn",
      api: "Tham khảo API",
      troubleshooting: "Khắc phục sự cố",
      faq: "Câu hỏi thường gặp",
      architecture: "Kiến trúc",
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








