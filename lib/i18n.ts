"use client"

// Multi-language support for Lab68 Platform

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "pt" | "ru" | "vi"

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
    }
    mission: {
      title: string
      description: string
    }
    techStack: {
      title: string
    }
    community: {
      title: string
      description: string
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
      },
      mission: {
        title: "Our Mission",
        description:
          "Lab68 is a brutalist developer platform designed for those who value function over form. We provide the tools, community, and resources you need to build exceptional software.",
      },
      techStack: {
        title: "Tech Stack",
      },
      community: {
        title: "Join the Community",
        description: "Connect with developers worldwide. Share knowledge. Build together.",
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
      editLabel: ""
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
  es: {
    nav: {
      home: "Inicio",
      dashboard: "Panel",
      projects: "Proyectos",
      aiTools: "Herramientas IA",
      community: "Comunidad",
      settings: "Configuración",
      signIn: "Iniciar Sesiión",
      signUp: "Registrarse",
      signOut: "Cerrar Sesiión",
      todo: "Tareas",
      meeting: "Reuniones",
      planning: "Planificaciión",
      diagrams: "Flujo y Diagramas",
    },
    auth: {
      signIn: "Iniciar Sesiión",
      signUp: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      name: "Nombre",
      createAccount: "Crear Cuenta",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      dontHaveAccount: "¿No tienes una cuenta?",
      signInButton: "Iniciar Sesiión",
      signUpButton: "Registrarse",
      rememberMe: "Recuérdame",
    },
    dashboard: {
      welcomeBack: "Bienvenido de nuevo",
      happeningToday: "Esto es lo que está pasando con tus proyectos hoy.",
      loading: "Cargando...",
      activeUsers: "Usuarios Activos",
      totalBuilds: "Compilaciones Totales",
      repositories: "Repositorios",
      apiCalls: "Llamadas API",
      recentProjects: "Proyectos Recientes",
      aiAssistant: "Asistente IA",
      systemStatus: "Estado del Sistema",
      askAnything: "Pregúntame cualquier cosa...",
      send: "Enviar",
      allSystemsOperational: "Todos los sistemas operativos",
      buildsInProgress: "compilaciones en progreso",
      connectedAndHealthy: "Conectado y saludable",
    },
    settings: {
      title: "Configuración",
      subtitle: "Administra tu cuenta y preferences",
      profile: "Perfil",
      username: "Nombre de Usuario",
      email: "Correo Electrónico",
      userId: "ID de Usuario",
      memberSince: "Miembro Desde",
      saveChanges: "Guardar Cambios",
      notifications: "Notificaciones",
      emailNotifications: "Notificaciones por Correo",
      emailNotificationsDesc: "Recibe actualizaciones sobre tus proyectos",
      buildNotifications: "Notificaciones de Compilación",
      buildNotificationsDesc: "Recibe notificaciones cuando se completen las compilaciones",
      meetingNotifications: "Notificaciones de Reuniones",
      meetingNotificationsDesc: "Recibe notificaciones sobre próximas reuniones",
      security: "Seguridad",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      updatePassword: "Actualizar Contraseña",
      appearance: "Apariencia",
      theme: "Tema",
      darkMode: "Modo Oscuro",
      lightMode: "Modo Claro",
      currentTheme: "Tema actual",
      comingSoon: "Próximamente",
      language: "Idioma",
      selectLanguage: "Selecciona tu idioma preferido",
      dangerZone: "Zona de Peligro",
      dangerZoneDesc: "Acciones irreversibles que afectarán permanentemente tu cuenta",
      deleteAccount: "Eliminar Cuenta",
      avatar: "Foto de Perfil",
      uploadAvatar: "Subir Foto",
  removeAvatar: "Eliminar",
  bio: "Biografía",
    },
    notifications: {
      title: "Notificaciones",
      noUpcoming: "No hay reuniones próximas",
      startsIn: "Comienza en",
    },
    landing: {
      hero: {
        title: "Piensa. Codifica. Prueba. Envía.",
        subtitle: "La plataforma definitiva para desarrolladores que construyen, aprenden y colaboran.",
        cta: "Entrar a Lab68",
      },
      mission: {
        title: "Nuestra Misión",
        description:
          "Lab68 es una plataforma de desarrollo brutalista diseñada para aquellos que valoran la función sobre la forma. Proporcionamos las herramientas, la comunidad y los recursos que necesitas para construir software excepcional.",
      },
      techStack: {
        title: "Stack Tecnológico",
      },
      community: {
        title: "Únete a la Comunidad",
        description: "Conéctate con desarrolladores de todo el mundo. Comparte conocimiento. Construye juntos.",
      },
    },
    todo: {
      title: "Tareas",
      subtitle: "Gestiona tus tareas y mantente organizado",
      addTask: "Agregar Tarea",
      taskName: "Nombre de la Tarea",
      taskDescription: "Descripción de la Tarea",
      priority: "Prioridad",
      low: "Baja",
      medium: "Media",
      high: "Alta",
      create: "Crear Tarea",
      noTasks: "No hay tareas aún",
      startAdding: "Comienza a agregar tareas para mantenerte organizado",
      completed: "Completadas",
      pending: "Pendientes",
      markComplete: "Marcar Completa",
      markIncomplete: "Marcar Incompleta",
      delete: "Eliminar",
    },
    meeting: {
      title: "Reuniones",
      subtitle: "Programa y gestiona tus reuniones",
      scheduleMeeting: "Programar Reunión",
      meetingTitle: "Título de la Reunión",
      meetingDescription: "Descripción de la Reunión",
      date: "Fecha",
      time: "Hora",
      duration: "Duraciión",
      minutes: "minutos",
      schedule: "Programar Reunión",
      noMeetings: "No hay reuniones programadas",
      startScheduling: "Comienza a programar reuniones para mantenerte organizado",
      upcoming: "Prióximas",
      past: "Pasadas",
      cancel: "Cancelar Reunión",
    },
    planning: {
      title: "Planificaciión",
      subtitle: "Planifica y rastrea tus proyectos",
      createPlan: "Crear Plan",
      planName: "Nombre del Plan",
      planDescription: "Descripción del Plan",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      status: "Estado",
      notStarted: "No Iniciado",
      inProgress: "En Progreso",
      completed: "Completado",
      create: "Crear Plan",
      noPlans: "No hay planes aún",
      startPlanning: "Comienza a planificar tus proyectos",
      addMilestone: "Agregar Hito",
      milestoneName: "Nombre del Hito",
      milestoneDate: "Fecha del Hito",
      delete: "Eliminar",
    },
    projects: {
      title: "Proyectos",
      subtitle: "Administra y monitorea tus proyectos de desarrollo",
      newProject: "Nuevo Proyecto",
      projectName: "Nombre del Proyecto",
      projectDescription: "Descripción del Proyecto",
      technologies: "Tecnologías (separadas por comas)",
      status: "Status",
      active: "Activo",
      building: "Construyendo",
      inProgress: "En Progreso",
      create: "Crear Proyecto",
      noProjects: "Aún no hay proyectos",
      startCreating: "Comienza a crear proyectos para rastrear tu trabajo",
      lastUpdated: "Última actualización",
      edit: "Editar",
      delete: "Eliminar",
      cancel: "Cancelar",
      save: "Guardar Cambios",
      editProject: "Editar Proyecto",
      kanban: "Tablero Kanban",
      viewKanban: "Ver Kanban",
      collaborators: "Colaboradores",
      addCollaborator: "Agregar Colaborador",
      inviteByEmail: "Invitar por correo",
      invite: "Invitar",
      removeCollaborator: "Eliminar",
      owner: "Propietario",
      noCollaborators: "Aún no hay colaboradores",
      role: "Rol",
      selectRole: "Seleccionar rol",
      roleOwner: "Propietario",
      roleAdmin: "Administrador",
      roleEditor: "Editor",
      roleViewer: "Observador",
      permissions: "Permisos",
      canEdit: "Puede editar",
      canDelete: "Puede eliminar",
      canInvite: "Puede invitar",
      canManageRoles: "Puede gestionar roles",
      canViewActivity: "Puede ver actividad",
      activity: "Actividad",
      recentActivity: "Actividad Reciente",
      noActivity: "Sin actividad reciente",
      lastActive: "Última actividad",
      addedBy: "Agregado por",
      changeRole: "Cambiar Rol",
      member: "miembro",
      members: "miembros",
    },
    community: {
      title: "Comunidad",
      subtitle: "Conéctate con desarrolladores, comparte conocimiento y colabora",
      newDiscussion: "Nueva Discusión",
      discussionTitle: "Título de la Discusión",
      discussionContent: "¿Qué estás pensando?",
      category: "Categoría",
      selectCategory: "Selecciona una categoría",
      customCategory: "Nombre de Categoría Personalizada",
      post: "Publicar Discusión",
      noDiscussions: "Aún no hay discusiones",
      startDiscussion: "Sé el primero en iniciar una discusión",
      replies: "respuestas",
      by: "por",
      cancel: "Cancelar",
      general: "General",
      help: "Ayuda",
      showcase: "Mostrar",
      feedback: "Comentarios",
      announcements: "Anuncios",
    },
    kanban: {
      title: "Tablero Kanban",
      backToProjects: "Volver a Proyectos",
      addCard: "Agregar Tarjeta",
      addColumn: "Agregar Columna",
      columnName: "Nombre de Columna",
      cardTitle: "Título de Tarjeta",
      cardDescription: "Descripción de Tarjeta",
      assignee: "Asignado a",
      dueDate: "Fecha de Vencimiento",
      create: "Crear",
      cancel: "Cancelar",
      deleteCard: "Eliminar Tarjeta",
      deleteColumn: "Eliminar Columna",
      editCard: "Editar Tarjeta",
      save: "Guardar Cambios",
      noCards: "Aún no hay tarjetas",
      dragCard: "Arrastra tarjetas entre columnas",
    },
    diagrams: {
      title: "Flujo y Diagramas",
      createNew: "Crear Nuevo Diagrama",
      noDiagrams: "Aún no hay diagramas",
      noDiagramsDesc: "Crea tu primer diagrama de flujo para visualizar tus procesos",
      diagramName: "Nombre del Diagrama",
      description: "Descripción",
      create: "Crear",
      edit: "Editar",
      delete: "Eliminar",
      confirmDelete: "¿Estás seguro de que quieres eliminar este diagrama?",
      cancel: "Cancelar",
      save: "Guardar",
      addNode: "Agregar Nodo",
      addConnection: "Agregar Conexiión",
      nodeTypes: {
        start: "Inicio",
        process: "Proceso",
        decision: "Decisiión",
        end: "Fin",
        data: "Datos",
      },
      tools: {
        select: "Seleccionar",
        move: "Mover",
        delete: "Eliminar",
        connect: "Conectar",
      },
      exportImage: "Exportar como Imagen",
      exportJSON: "Exportar como JSON",
      clear: "Limpiar Lienzo",
      zoom: "Zoom",
      editLabel: ""
    },
    files: {
      title: "Archivos y Documentos",
      subtitle: "Almacenar, compartir y gestionar archivos y enlaces de proyectos",
      uploadFile: "Subir Archivo",
      addLink: "Agregar Enlace",
      fileName: "Nombre del Archivo",
      fileDescription: "Descripción",
      fileUrl: "URL del Archivo",
      linkUrl: "URL del Enlace",
      linkTitle: "Título del Enlace",
      linkDescription: "Descripción del Enlace",
      upload: "Subir",
      addLinkButton: "Agregar Enlace",
      cancel: "Cancelar",
      noFiles: "Sin archivos o enlaces aún",
      startUploading: "Sube tu primer archivo o agrega un enlace para comenzar",
      uploadedBy: "Subido por",
      linkedBy: "Agregado por",
      delete: "Eliminar",
      download: "Descargar",
      openLink: "Abrir Enlace",
      type: "Tipo",
      uploaded: "Subido",
      linked: "Enlace",
      relatedTo: "Relacionado con",
      project: "Proyecto",
      task: "Tarea",
      meeting: "Reunión",
      design: "Diseño",
      documentation: "Documentaciión",
      planning: "Planificaciión",
      research: "Investigaciión",
      general: "General",
  architecture: "Arquitectura",
    },
    wiki: {
      title: "Base de Conocimientos",
      subtitle: "Documentar procesos, mejores prácticas y resúmenes de proyectos",
      createArticle: "Crear Artículo",
      articleTitle: "Título del Artículo",
      articleContent: "Contenido",
      category: "Categoría",
      tags: "Etiquetas",
      tagsPlaceholder: "Agregar etiquetas separadas por comas",
      create: "Crear",
      edit: "Editar",
      delete: "Eliminar",
      cancel: "Cancelar",
      save: "Guardar",
      noArticles: "Sin artículos aún",
      startWriting: "Crea tu primer artículo para comenzar a construir tu base de conocimientos",
      lastUpdated: "Última actualización",
      author: "Autor",
      readMore: "Leer Más",
      backToList: "Volver a Artículos",
      confirmDelete: "¿Estás seguro de que quieres eliminar este artículo?",
      processes: "Procesos",
      bestPractices: "Mejores Prácticas",
      projectSummaries: "Resúmenes de Proyectos",
      tutorials: "Tutoriales",
      documentation: "Documentaciión",
      guidelines: "Directrices",
      api: "Referencia API",
      troubleshooting: "Soluciión de Problemas",
      faq: "Preguntas Frecuentes",
      architecture: "Arquitectura",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      dashboard: "Tableau de Bord",
      projects: "Projets",
      aiTools: "Outils IA",
      community: "Communauté",
      settings: "Paramètres",
      signIn: "Se Connecter",
      signUp: "S'inscrire",
      signOut: "Se Déconnecter",
      todo: "Tâches",
      meeting: "Réunions",
      planning: "Planification",
      diagrams: "Flux et Diagrammes",
    },
    auth: {
      signIn: "Se Connecter",
      signUp: "S'inscrire",
      email: "Email",
      password: "Mot de Passe",
      name: "Nom",
      createAccount: "Créer un Compte",
      alreadyHaveAccount: "Vous avez déjà un compte?",
      dontHaveAccount: "Vous n'avez pas de compte?",
      signInButton: "Se Connecter",
      signUpButton: "S'inscrire",
      rememberMe: "Se souvenir de moi",
    },
    dashboard: {
      welcomeBack: "Bon retour",
      happeningToday: "Voici ce qui se passe avec vos projets aujourd'hui.",
      loading: "Chargement...",
      activeUsers: "Utilisateurs Actifs",
      totalBuilds: "Builds Totaux",
      repositories: "Dépôts",
      apiCalls: "Appels API",
      recentProjects: "Projets Récents",
      aiAssistant: "Assistant IA",
      systemStatus: "État du Système",
      askAnything: "Demandez-moi n'importe quoi...",
      send: "Envoyer",
      allSystemsOperational: "Tous les systèmes opérationnels",
      buildsInProgress: "builds en cours",
      connectedAndHealthy: "Connecté et en bonne santé",
    },
    settings: {
      title: "Paramètres",
      subtitle: "Gérez votre compte et vos préférences",
      profile: "Profil",
      username: "Nom d'Utilisateur",
      email: "Email",
      userId: "ID Utilisateur",
      memberSince: "Membre Depuis",
      saveChanges: "Enregistrer les Modifications",
      notifications: "Notifications",
      emailNotifications: "Notifications par Email",
      emailNotificationsDesc: "Recevez des mises â  jour sur vos projets",
      buildNotifications: "Notifications de Build",
      buildNotificationsDesc: "Soyez notifié lorsque les builds sont terminés",
      meetingNotifications: "Notifications de Réunion",
      meetingNotificationsDesc: "Recevoir des notifications sur les réunions à venir",
      avatar: "Photo de Profil",
      uploadAvatar: "Télécharger une Photo",
  removeAvatar: "Supprimer",
  bio: "Biographie",
      security: "Sécurité",
      currentPassword: "Mot de Passe Actuel",
      newPassword: "Nouveau Mot de Passe",
      updatePassword: "Mettre â  Jour le Mot de Passe",
      appearance: "Apparence",
      theme: "Thème",
      darkMode: "Mode Sombre",
      lightMode: "Mode Clair",
      currentTheme: "Thème actuel",
      comingSoon: "Bientôt disponible",
      language: "Langue",
      selectLanguage: "Sélectionnez votre langue préférée",
      dangerZone: "Zone de Danger",
      dangerZoneDesc: "Actions irréversibles qui affecteront définitivement votre compte",
      deleteAccount: "Supprimer le Compte",
    },
    notifications: {
      title: "Notifications",
      noUpcoming: "Aucune réunion à venir",
      startsIn: "Commence dans",
    },
    landing: {
      hero: {
        title: "Penser. Coder. Tester. Livrer.",
        subtitle: "La plateforme ultime pour les développeurs qui construisent, apprennent et collaborent.",
        cta: "Entrer dans Lab68",
      },
      mission: {
        title: "Notre Mission",
        description:
          "Lab68 est une plateforme de développement brutaliste conçue pour ceux qui valorisent la fonction plutôt que la forme. Nous fournissons les outils, la communauté et les ressources dont vous avez besoin pour créer des logiciels exceptionnels.",
      },
      techStack: {
        title: "Stack Technologique",
      },
      community: {
        title: "Rejoignez la Communauté",
        description:
          "Connectez-vous avec des développeurs du monde entier. Partagez vos connaissances. Construisez ensemble.",
      },
    },
    todo: {
      title: "Tâches",
      subtitle: "Gérez vos tâches et restez organisé",
      addTask: "Ajouter une Tâche",
      taskName: "Nom de la Tâche",
      taskDescription: "Description de la Tâche",
      priority: "Priorité",
      low: "Basse",
      medium: "Moyenne",
      high: "Haute",
      create: "Créer une Tâche",
      noTasks: "Pas encore de tâches",
      startAdding: "Commencez â  ajouter des tâches pour rester organisé",
      completed: "Terminées",
      pending: "En Attente",
      markComplete: "Marquer Terminée",
      markIncomplete: "Marquer Incomplète",
      delete: "Supprimer",
    },
    meeting: {
      title: "Réunions",
      subtitle: "Planifiez et gérez vos réunions",
      scheduleMeeting: "Planifier une Réunion",
      meetingTitle: "Titre de la Réunion",
      meetingDescription: "Description de la Réunion",
      date: "Date",
      time: "Heure",
      duration: "Durée",
      minutes: "minutes",
      schedule: "Planifier une Réunion",
      noMeetings: "Aucune réunion planifiée",
      startScheduling: "Commencez â  planifier des réunions pour rester organisé",
      upcoming: "À Venir",
      past: "Passées",
      cancel: "Annuler la Réunion",
    },
    planning: {
      title: "Planification",
      subtitle: "Planifiez et suivez vos projets",
      createPlan: "Créer un Plan",
      planName: "Nom du Plan",
      planDescription: "Description du Plan",
      startDate: "Date de Début",
      endDate: "Date de Fin",
      status: "Statut",
      notStarted: "Non Commencé",
      inProgress: "En Cours",
      completed: "Terminé",
      create: "Créer un Plan",
      noPlans: "Pas encore de plans",
      startPlanning: "Commencez â  planifier vos projets",
      addMilestone: "Ajouter une Étape",
      milestoneName: "Nom de l'Étape",
      milestoneDate: "Date de l'Étape",
      delete: "Supprimer",
    },
    projects: {
      title: "Projets",
      subtitle: "Gérez et surveillez vos projets de développement",
      newProject: "Nouveau Projet",
      projectName: "Nom du Projet",
      projectDescription: "Description du Projet",
      technologies: "Technologies (séparées par des virgules)",
      status: "Statut",
      active: "Actif",
      building: "En Construction",
      inProgress: "En Cours",
      create: "Créer un Projet",
      noProjects: "Pas encore de projets",
      startCreating: "Commencez â  créer des projets pour suivre votre travail",
      lastUpdated: "Dernière mise â  jour",
      edit: "Modifier",
      delete: "Supprimer",
      cancel: "Annuler",
      save: "Enregistrer les Modifications",
      editProject: "Modifier le Projet",
      kanban: "Tableau Kanban",
      viewKanban: "Voir Kanban",
      collaborators: "Collaborateurs",
      addCollaborator: "Ajouter un Collaborateur",
      inviteByEmail: "Inviter par email",
      invite: "Inviter",
      removeCollaborator: "Supprimer",
      owner: "Propriétaire",
      noCollaborators: "Pas encore de collaborateurs",
      role: "Rôle",
      selectRole: "Sélectionner le rôle",
      roleOwner: "Propriétaire",
      roleAdmin: "Administrateur",
      roleEditor: "Éditeur",
      roleViewer: "Observateur",
      permissions: "Permissions",
      canEdit: "Peut modifier",
      canDelete: "Peut supprimer",
      canInvite: "Peut inviter",
      canManageRoles: "Peut gérer les rôles",
      canViewActivity: "Peut voir l'activité",
      activity: "Activité",
      recentActivity: "Activité Récente",
      noActivity: "Aucune activité récente",
      lastActive: "Dernière activité",
      addedBy: "Ajouté par",
      changeRole: "Changer le Rôle",
      member: "membre",
      members: "membres",
    },
    community: {
      title: "Communauté",
      subtitle: "Connectez-vous avec des développeurs, partagez vos connaissances et collaborez",
      newDiscussion: "Nouvelle Discussion",
      discussionTitle: "Titre de la Discussion",
      discussionContent: "À quoi pensez-vous?",
      category: "Catégorie",
      selectCategory: "Sélectionnez une catégorie",
      customCategory: "Nom de Catégorie Personnalisée",
      post: "Publier la Discussion",
      noDiscussions: "Pas encore de discussions",
      startDiscussion: "Soyez le premier â  lancer une discussion",
      replies: "réponses",
      by: "par",
      cancel: "Annuler",
      general: "Général",
      help: "Aide",
      showcase: "Vitrine",
      feedback: "Commentaires",
      announcements: "Annonces",
    },
    kanban: {
      title: "Tableau Kanban",
      backToProjects: "Retour aux Projets",
      addCard: "Ajouter une Carte",
      addColumn: "Ajouter une Colonne",
      columnName: "Nom de la Colonne",
      cardTitle: "Titre de la Carte",
      cardDescription: "Description de la Carte",
      assignee: "Assigné â ",
      dueDate: "Date d'Échéance",
      create: "Créer",
      cancel: "Annuler",
      deleteCard: "Supprimer la Carte",
      deleteColumn: "Supprimer la Colonne",
      editCard: "Modifier la Carte",
      save: "Enregistrer les Modifications",
      noCards: "Pas encore de cartes",
      dragCard: "Faites glisser les cartes entre les colonnes",
    },
    diagrams: {
      title: "Flux et Diagrammes",
      createNew: "Créer un Nouveau Diagramme",
      noDiagrams: "Aucun diagramme pour le moment",
      noDiagramsDesc: "Créez votre premier organigramme pour visualiser vos processus",
      diagramName: "Nom du Diagramme",
      description: "Description",
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      confirmDelete: "âŠtes-vous sûr de vouloir supprimer ce diagramme?",
      cancel: "Annuler",
      save: "Enregistrer",
      addNode: "Ajouter un NÅ“ud",
      addConnection: "Ajouter une Connexion",
      nodeTypes: {
        start: "Début",
        process: "Processus",
        decision: "Décision",
        end: "Fin",
        data: "Données",
      },
      tools: {
        select: "Sélectionner",
        move: "Déplacer",
        delete: "Supprimer",
        connect: "Connecter",
      },
      exportImage: "Exporter en Image",
      exportJSON: "Exporter en JSON",
      clear: "Effacer le Canevas",
      zoom: "Zoom",
      editLabel: ""
    },
    files: {
      title: "Fichiers et Documents",
      subtitle: "Stocker, partager et gérer les fichiers et liens de projet",
      uploadFile: "Télécharger un fichier",
      addLink: "Ajouter un lien",
      fileName: "Nom du fichier",
      fileDescription: "Description",
      fileUrl: "URL du fichier",
      linkUrl: "URL du lien",
      linkTitle: "Titre du lien",
      linkDescription: "Description du lien",
      upload: "Télécharger",
      addLinkButton: "Ajouter un lien",
      cancel: "Annuler",
      noFiles: "Aucun fichier ou lien pour le moment",
      startUploading: "Téléchargez votre premier fichier ou ajoutez un lien pour commencer",
      uploadedBy: "Téléchargé par",
      linkedBy: "Ajouté par",
      delete: "Supprimer",
      download: "Télécharger",
      openLink: "Ouvrir le lien",
      type: "Type",
      uploaded: "Téléchargé",
      linked: "Lien",
      relatedTo: "Lié â ",
      project: "Projet",
      task: "Tâche",
      meeting: "Réunion",
      design: "Conception",
      documentation: "Documentation",
      planning: "Planification",
      research: "Recherche",
      general: "Général",
  architecture: "Architecture",
    },
    wiki: {
      title: "Base de Connaissances",
      subtitle: "Documenter les processus, les meilleures pratiques et les résumés de projets",
      createArticle: "Créer un Article",
      articleTitle: "Titre de l'Article",
      articleContent: "Contenu",
      category: "Catégorie",
      tags: "Étiquettes",
      tagsPlaceholder: "Ajouter des étiquettes séparées par des virgules",
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      cancel: "Annuler",
      save: "Enregistrer",
      noArticles: "Aucun article pour le moment",
      startWriting: "Créez votre premier article pour commencer â  construire votre base de connaissances",
      lastUpdated: "Dernière mise â  jour",
      author: "Auteur",
      readMore: "Lire la Suite",
      backToList: "Retour aux Articles",
      confirmDelete: "âŠtes-vous sûr de vouloir supprimer cet article?",
      processes: "Processus",
      bestPractices: "Meilleures Pratiques",
      projectSummaries: "Résumés de Projets",
      tutorials: "Tutoriels",
      documentation: "Documentation",
      guidelines: "Directives",
      api: "Référence API",
      troubleshooting: "Dépannage",
      faq: "FAQ",
      architecture: "Architecture",
    },
  },
  de: {
    nav: {
      home: "Startseite",
      dashboard: "Dashboard",
      projects: "Projekte",
      aiTools: "KI-Tools",
      community: "Community",
      settings: "Einstellungen",
      signIn: "Anmelden",
      signUp: "Registrieren",
      signOut: "Abmelden",
      todo: "Aufgaben",
      meeting: "Besprechungen",
      planning: "Planung",
      diagrams: "Fluss & Diagramme",
    },
    auth: {
      signIn: "Anmelden",
      signUp: "Registrieren",
      email: "E-Mail",
      password: "Passwort",
      name: "Name",
      createAccount: "Konto Erstellen",
      alreadyHaveAccount: "Haben Sie bereits ein Konto?",
      dontHaveAccount: "Haben Sie kein Konto?",
      signInButton: "Anmelden",
      signUpButton: "Registrieren",
      rememberMe: "Angemeldet bleiben",
    },
    dashboard: {
      welcomeBack: "Willkommen zurück",
      happeningToday: "Hier ist, was heute mit Ihren Projekten passiert.",
      loading: "Laden...",
      activeUsers: "Aktive Benutzer",
      totalBuilds: "Gesamte Builds",
      repositories: "Repositories",
      apiCalls: "API-Aufrufe",
      recentProjects: "Letzte Projekte",
      aiAssistant: "KI-Assistent",
      systemStatus: "Systemstatus",
      askAnything: "Fragen Sie mich alles...",
      send: "Senden",
      allSystemsOperational: "Alle Systeme betriebsbereit",
      buildsInProgress: "Builds in Bearbeitung",
      connectedAndHealthy: "Verbunden und gesund",
    },
    settings: {
      title: "Einstellungen",
      subtitle: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
      profile: "Profil",
      username: "Benutzername",
      email: "E-Mail",
      userId: "Benutzer-ID",
      memberSince: "Mitglied Seit",
      saveChanges: "Änderungen Speichern",
      notifications: "Benachrichtigungen",
      emailNotifications: "E-Mail-Benachrichtigungen",
      emailNotificationsDesc: "Erhalten Sie Updates zu Ihren Projekten",
      buildNotifications: "Build-Benachrichtigungen",
      buildNotificationsDesc: "Werden Sie benachrichtigt, wenn Builds abgeschlossen sind",
      meetingNotifications: "Besprechungs-Benachrichtigungen",
      meetingNotificationsDesc: "Erhalten Sie Benachrichtigungen über bevorstehende Besprechungen",
      avatar: "Profilbild",
      uploadAvatar: "Foto Hochladen",
  removeAvatar: "Entfernen",
  bio: "Biografie",
      security: "Sicherheit",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      updatePassword: "Passwort Aktualisieren",
      appearance: "Erscheinungsbild",
      theme: "Thema",
      darkMode: "Dunkler Modus",
      lightMode: "Heller Modus",
      currentTheme: "Aktuelles Thema",
      comingSoon: "Demnächst",
      language: "Sprache",
      selectLanguage: "Wählen Sie Ihre bevorzugte Sprache",
      dangerZone: "Gefahrenzone",
      dangerZoneDesc: "Irreversible Aktionen, die Ihr Konto dauerhaft beeinflussen",
      deleteAccount: "Konto Löschen",
    },
    notifications: {
      title: "Benachrichtigungen",
      noUpcoming: "Keine bevorstehenden Besprechungen",
      startsIn: "Beginnt in",
    },
    landing: {
      hero: {
        title: "Denken. Codieren. Testen. Versenden.",
        subtitle: "Die ultimative Plattform für Entwickler, die bauen, lernen und zusammenarbeiten.",
        cta: "Lab68 Betreten",
      },
      mission: {
        title: "Unsere Mission",
        description:
          "Lab68 ist eine brutalistische Entwicklerplattform für diejenigen, die Funktion über Form schätzen. Wir bieten die Tools, die Community und die Ressourcen, die Sie benötigen, um außergewöhnliche Software zu erstellen.",
      },
      techStack: {
        title: "Tech-Stack",
      },
      community: {
        title: "Treten Sie der Community Bei",
        description: "Verbinden Sie sich mit Entwicklern weltweit. Share knowledge. Build together.",
      },
    },
    todo: {
      title: "Aufgaben",
      subtitle: "Verwalten Sie Ihre Aufgaben und bleiben Sie organisiert",
      addTask: "Aufgabe Hinzufügen",
      taskName: "Aufgabenname",
      taskDescription: "Aufgabenbeschreibung",
      priority: "Priorität",
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      create: "Aufgabe Erstellen",
      noTasks: "Noch keine Aufgaben",
      startAdding: "Beginnen Sie mit dem Hinzufügen von Aufgaben, um organisiert zu bleiben",
      completed: "Abgeschlossen",
      pending: "Ausstehend",
      markComplete: "Als Abgeschlossen Markieren",
      markIncomplete: "Als Unvollständig Markieren",
      delete: "Löschen",
    },
    meeting: {
      title: "Besprechungen",
      subtitle: "Planen und verwalten Sie Ihre Besprechungen",
      scheduleMeeting: "Besprechung Planen",
      meetingTitle: "Besprechungstitel",
      meetingDescription: "Besprechungsbeschreibung",
      date: "Datum",
      time: "Uhrzeit",
      duration: "Dauer",
      minutes: "Minuten",
      schedule: "Besprechung Planen",
      noMeetings: "Keine Besprechungen geplant",
      startScheduling: "Beginnen Sie mit der Planung von Besprechungen, um organisiert zu bleiben",
      upcoming: "Bevorstehend",
      past: "Vergangene",
      cancel: "Besprechung Absagen",
    },
    planning: {
      title: "Planung",
      subtitle: "Planen und verfolgen Sie Ihre Projekte",
      createPlan: "Plan Erstellen",
      planName: "Planname",
      planDescription: "Planbeschreibung",
      startDate: "Startdatum",
      endDate: "Enddatum",
      status: "Status",
      notStarted: "Nicht Gestartet",
      inProgress: "In Bearbeitung",
      completed: "Abgeschlossen",
      create: "Plan Erstellen",
      noPlans: "Noch keine Pläne",
      startPlanning: "Beginnen Sie mit der Planung Ihrer Projekte",
      addMilestone: "Meilenstein Hinzufügen",
      milestoneName: "Meilensteinname",
      milestoneDate: "Meilensteindatum",
      delete: "Löschen",
    },
    projects: {
      title: "Projekte",
      subtitle: "Verwalten und überwachen Sie Ihre Entwicklungsprojekte",
      newProject: "Neues Projekt",
      projectName: "Projektname",
      projectDescription: "Projektbeschreibung",
      technologies: "Technologien (durch Kommas getrennt)",
      status: "Status",
      active: "Aktiv",
      building: "Im Aufbau",
      inProgress: "In Bearbeitung",
      create: "Projekt Erstellen",
      noProjects: "Noch keine Projekte",
      startCreating: "Beginnen Sie mit der Erstellung von Projekten, um Ihre Arbeit zu verfolgen",
      lastUpdated: "Zuletzt aktualisiert",
      edit: "Bearbeiten",
      delete: "Löschen",
      cancel: "Abbrechen",
      save: "Änderungen Speichern",
      editProject: "Projekt Bearbeiten",
      kanban: "Kanban-Board",
      viewKanban: "Kanban Ansehen",
      collaborators: "Mitarbeiter",
      addCollaborator: "Mitarbeiter Hinzufügen",
      inviteByEmail: "Per E-Mail einladen",
      invite: "Einladen",
            removeCollaborator: "Entfernen",
      owner: "Eigentümer",
      noCollaborators: "Noch keine Mitarbeiter",
      role: "Rolle",
      selectRole: "Rolle auswählen",
      roleOwner: "Eigentümer",
      roleAdmin: "Administrator",
      roleEditor: "Bearbeiter",
      roleViewer: "Betrachter",
      permissions: "Berechtigungen",
      canEdit: "Kann bearbeiten",
      canDelete: "Kann löschen",
      canInvite: "Kann einladen",
      canManageRoles: "Kann Rollen verwalten",
      canViewActivity: "Kann Aktivität sehen",
      activity: "Aktivität",
      recentActivity: "Letzte Aktivität",
      noActivity: "Keine aktuelle Aktivität",
      lastActive: "Zuletzt aktiv",
      addedBy: "Hinzugefügt von",
      changeRole: "Rolle ändern",
      member: "Mitglied",
      members: "Mitglieder",
    },
    community: {
      title: "Community",
      subtitle: "Verbinden Sie sich mit Entwicklern, teilen Sie Wissen und arbeiten Sie zusammen",
      newDiscussion: "Neue Diskussion",
      discussionTitle: "Diskussionstitel",
      discussionContent: "Was denken Sie?",
      category: "Kategorie",
      selectCategory: "Wählen Sie eine Kategorie",
      customCategory: "Benutzerdefinierter Kategoriename",
      post: "Diskussion Veröffentlichen",
      noDiscussions: "Noch keine Diskussionen",
      startDiscussion: "Seien Sie der Erste, der eine Diskussion startet",
      replies: "Antworten",
      by: "von",
      cancel: "Abbrechen",
      general: "Allgemein",
      help: "Hilfe",
      showcase: "Präsentation",
      feedback: "Feedback",
      announcements: "Ankündigungen",
    },
    kanban: {
      title: "Kanban-Board",
      backToProjects: "Zurück zu Projekten",
      addCard: "Karte Hinzufügen",
      addColumn: "Spalte Hinzufügen",
      columnName: "Spaltenname",
      cardTitle: "Kartentitel",
      cardDescription: "Kartenbeschreibung",
      assignee: "Zugewiesen an",
      dueDate: "Fälligkeitsdatum",
      create: "Erstellen",
      cancel: "Abbrechen",
      deleteCard: "Karte Löschen",
      deleteColumn: "Spalte Löschen",
      editCard: "Karte Bearbeiten",
      save: "Änderungen Speichern",
      noCards: "Noch keine Karten",
      dragCard: "Ziehen Sie Karten zwischen Spalten",
    },
    diagrams: {
      title: "Fluss & Diagramme",
      createNew: "Neues Diagramm Erstellen",
      noDiagrams: "Noch keine Diagramme",
      noDiagramsDesc: "Erstellen Sie Ihr erstes Flussdiagramm zur Visualisierung Ihrer Prozesse",
      diagramName: "Diagrammname",
      description: "Beschreibung",
      create: "Erstellen",
      edit: "Bearbeiten",
      delete: "Löschen",
      confirmDelete: "Möchten Sie dieses Diagramm wirklich löschen?",
      cancel: "Abbrechen",
      save: "Speichern",
      addNode: "Knoten Hinzufügen",
      addConnection: "Verbindung Hinzufügen",
      nodeTypes: {
        start: "Start",
        process: "Prozess",
        decision: "Entscheidung",
        end: "Ende",
        data: "Daten",
      },
      tools: {
        select: "Auswählen",
        move: "Bewegen",
        delete: "Löschen",
        connect: "Verbinden",
      },
      exportImage: "Als Bild Exportieren",
      exportJSON: "Als JSON Exportieren",
      clear: "Leinwand Löschen",
      zoom: "Zoom",
      editLabel: ""
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
    },
  },
  zh: {
    nav: {
      home: "首页",
      dashboard: "仪表板",
      projects: "项目",
      aiTools: "AI 工具",
      community: "社区",
      settings: "设置",
      signIn: "登录",
      signUp: "注册",
      signOut: "退出",
      todo: "待办事项",
      meeting: "会议",
      planning: "规划",
      diagrams: "流程图",
    },
    auth: {
      signIn: "ç™»å½•",
      signUp: "æ³¨å†Œ",
      email: "é‚®ç®±",
      password: "å¯†ç ",
      name: "å§“å",
      createAccount: "åˆ›å»ºè´¦æˆ·",
      alreadyHaveAccount: "å·²æœ‰è´¦æˆ·ï¼Ÿ",
      dontHaveAccount: "æ²¡æœ‰è´¦æˆ·ï¼Ÿ",
      signInButton: "ç™»å½•",
      signUpButton: "æ³¨å†Œ",
      rememberMe: "è®°ä½æˆ‘",
    },
    dashboard: {
      welcomeBack: "æ¬¢è¿Žå›žæ¥",
      happeningToday: "这是您今天项目的最新动态。",
      loading: "åŠ è½½ä¸­...",
      activeUsers: "活跃用户",
      totalBuilds: "æ€»æž„å»ºæ•°",
      repositories: "ä»“åº“",
      apiCalls: "API调用",
      recentProjects: "æœ€è¿‘é¡¹ç›®",
      aiAssistant: "AIåŠ©æ‰‹",
      systemStatus: "ç³»ç»ŸçŠ¶æ€",
      askAnything: "é—®æˆ‘ä»»ä½•é—®é¢˜...",
      send: "å‘é€",
      allSystemsOperational: "æ‰€æœ‰ç³»ç»Ÿæ­£å¸¸è¿è¡Œ",
      buildsInProgress: "ä¸ªæž„å»ºæ­£åœ¨è¿›è¡Œ",
      connectedAndHealthy: "å·²è¿žæŽ¥ä¸”å¥åº·",
    },
    settings: {
      title: "设置",
      subtitle: "管理您的账户和偏好",
      profile: "个人资料",
      username: "用户名",
      email: "邮箱",
      userId: "用户ID",
      memberSince: "注册时间",
      saveChanges: "保存更改",
      notifications: "通知",
      emailNotifications: "邮件通知",
      emailNotificationsDesc: "接收有关您项目的更新",
      buildNotifications: "构建通知",
      buildNotificationsDesc: "构建完成时接收通知",
      meetingNotifications: "会议通知",
      meetingNotificationsDesc: "获取即将召开会议的通知",
      avatar: "头像",
      uploadAvatar: "上传照片",
  removeAvatar: "删除",
  bio: "个人简介",
      security: "安全",
      currentPassword: "当前密码",
      newPassword: "新密码",
      updatePassword: "更新密码",
      appearance: "外观",
      theme: "主题",
      darkMode: "深色模式",
      lightMode: "浅色模式",
      currentTheme: "当前主题",
      comingSoon: "即将推出",
      language: "语言",
      selectLanguage: "选择您的首选语言",
      dangerZone: "危险区域",
      dangerZoneDesc: "不可逆的操作会永久影响您的账户",
      deleteAccount: "删除账户",
    },
    notifications: {
      title: "通知",
      noUpcoming: "没有即将召开的会议",
      startsIn: "开始于",
    },
    landing: {
      hero: {
        title: "思考。编程。测试。发布。",
        subtitle: "为构建、学习和协作的开发者打造的终极平台。",
        cta: "è¿›å…¥Lab68",
      },
      mission: {
        title: "æˆ‘ä»¬çš„ä½¿å‘½",
        description:
          "Lab68æ˜¯ä¸€ä¸ªç²—é‡Žä¸»ä¹‰å¼€å‘è€…å¹³å°ï¼Œä¸“ä¸ºé‚£äº›é‡è§†åŠŸèƒ½èƒœè¿‡å½¢å¼çš„äººè®¾è®¡â€‚æˆ‘ä»¬æä¾›æ‚¨æž„å»ºå“è¶Šè½¯ä»¶æ‰€éœ€çš„å·¥å…·â€ç¤¾åŒºå’Œèµ„æºâ€‚",
      },
      techStack: {
        title: "æŠ€æœ¯æ ˆ",
      },
      community: {
        title: "åŠ å…¥ç¤¾åŒº",
        description: "与全球开发者连系。分享知识。共同构建。",
      },
    },
    todo: {
      title: "å¾…åŠžäº‹é¡¹",
      subtitle: "ç®¡ç†æ‚¨çš„ä»»åŠ¡å¹¶ä¿æŒäº•ç„¶æœ‰åº",
      addTask: "æ·»åŠ ä»»åŠ¡",
      taskName: "ä»»åŠ¡åç§°",
      taskDescription: "ä»»åŠ¡æè¿°",
      priority: "ä¼˜å…ˆçº§",
      low: "ä½Ž",
      medium: "ä¸­",
      high: "é«˜",
      create: "åˆ›å»ºä»»åŠ¡",
      noTasks: "è¿˜æ²¡æœ‰ä»»åŠ¡",
      startAdding: "å¼€å§‹æ·»åŠ ä»»åŠ¡ä»¥ä¿æŒäº•ç„¶æœ‰åº",
      completed: "å·²å®Œæˆ",
      pending: "å¾…å¤„ç†",
      markComplete: "æ ‡è®°ä¸ºå®Œæˆ",
      markIncomplete: "æ ‡è®°ä¸ºæœªå®Œæˆ",
      delete: "åˆ é™¤",
    },
    meeting: {
      title: "ä¼šè®®",
      subtitle: "å®‰æŽ’å’Œç®¡ç†æ‚¨çš„ä¼šè®®",
      scheduleMeeting: "å®‰æŽ’ä¼šè®®",
      meetingTitle: "ä¼šè®®æ ‡é¢˜",
      meetingDescription: "ä¼šè®®æè¿°",
      date: "æ—¥æœŸ",
      time: "æ—¶é—´",
      duration: "æŒç»­æ—¶é—´",
      minutes: "åˆ†é’Ÿ",
      schedule: "å®‰æŽ’ä¼šè®®",
      noMeetings: "æ²¡æœ‰å®‰æŽ’ä¼šè®®",
      startScheduling: "å¼€å§‹å®‰æŽ’ä¼šè®®ä»¥ä¿æŒäº•ç„¶æœ‰åº",
      upcoming: "å³å°†åˆ°æ¥",
      past: "è¿‡åŽ»",
      cancel: "å–æ¶ˆä¼šè®®",
    },
    planning: {
      title: "è§„åˆ’",
      subtitle: "è§„åˆ’å’Œè·Ÿè¸ªæ‚¨çš„é¡¹ç›®",
      createPlan: "åˆ›å»ºè®¡åˆ’",
      planName: "è®¡åˆ’åç§°",
      planDescription: "è®¡åˆ’æè¿°",
      startDate: "å¼€å§‹æ—¥æœŸ",
      endDate: "ç»“æŸæ—¥æœŸ",
      status: "çŠ¶æ€",
      notStarted: "æœªå¼€å§‹",
      inProgress: "è¿›è¡Œä¸­",
      completed: "å·²å®Œæˆ",
      create: "åˆ›å»ºè®¡åˆ’",
      noPlans: "è¿˜æ²¡æœ‰è®¡åˆ’",
      startPlanning: "å¼€å§‹è§„åˆ’æ‚¨çš„é¡¹ç›®",
      addMilestone: "æ·»åŠ é‡Œç¨‹ç¢‘",
      milestoneName: "é‡Œç¨‹ç¢‘åç§°",
      milestoneDate: "é‡Œç¨‹ç¢‘æ—¥æœŸ",
      delete: "åˆ é™¤",
    },
    projects: {
      title: "é¡¹ç›®",
      subtitle: "ç®¡ç†å’Œç›‘æŽ§æ‚¨çš„å¼€å‘é¡¹ç›®",
      newProject: "æ–°é¡¹ç›®",
      projectName: "é¡¹ç›®åç§°",
      projectDescription: "é¡¹ç›®æè¿°",
      technologies: "æŠ€æœ¯ï¼ˆç”¨é€—å·åˆ†éš”ï¼‰",
      status: "çŠ¶æ€",
      active: "活跃",
      building: "æž„å»ºä¸­",
      inProgress: "è¿›è¡Œä¸­",
      create: "åˆ›å»ºé¡¹ç›®",
      noProjects: "è¿˜æ²¡æœ‰é¡¹ç›®",
      startCreating: "å¼€å§‹åˆ›å»ºé¡¹ç›®ä»¥è·Ÿè¸ªæ‚¨çš„å·¥ä½œ",
      lastUpdated: "æœ€åŽæ›´æ–°",
      edit: "ç¼–è¾‘",
      delete: "åˆ é™¤",
      cancel: "å–æ¶ˆ",
      save: "ä¿å­˜æ›´æ”¹",
      editProject: "ç¼–è¾‘é¡¹ç›®",
      kanban: "çœ‹æ¿",
      viewKanban: "æŸ¥çœ‹çœ‹æ¿",
      collaborators: "åä½œè€…",
      addCollaborator: "æ·»åŠ åä½œè€…",
      inviteByEmail: "é€šè¿‡é‚®ç®±é‚€è¯·",
      invite: "é‚€è¯·",
      removeCollaborator: "ç§»é™¤",
      owner: "æ‰€æœ‰è€…",
      noCollaborators: "è¿˜æ²¡æœ‰åä½œè€…",
      role: "角色",
      selectRole: "选择角色",
      roleOwner: "所有者",
      roleAdmin: "管理员",
      roleEditor: "编辑者",
      roleViewer: "查看者",
      permissions: "权限",
      canEdit: "可以编辑",
      canDelete: "可以删除",
      canInvite: "可以邀请",
      canManageRoles: "可以管理角色",
      canViewActivity: "可以查看活动",
      activity: "活动",
      recentActivity: "最近活动",
      noActivity: "无最近活动",
      lastActive: "最后活跃",
      addedBy: "添加者",
      changeRole: "更改角色",
      member: "成员",
      members: "成员",
    },
    community: {
      title: "ç¤¾åŒº",
      subtitle: "ä¸Žå¼€å‘è€…è”ç³»ï¼Œåˆ†äº«çŸ¥è¯†ï¼Œåä½œ",
      newDiscussion: "æ–°è®¨è®º",
      discussionTitle: "討論タイトル",
      discussionContent: "何を考えていますか？",
      category: "カテゴリー",
      selectCategory: "カテゴリーを選択",
      customCategory: "カスタムカテゴリー名",
      post: "討論を投稿",
      noDiscussions: "まだ討論がありません",
      startDiscussion: "最初に討論を始めましょう",
      replies: "返信",
      by: "投稿者",
      cancel: "キャンセル",
      general: "一般",
      help: "ヘルプ",
      showcase: "ショーケース",
      feedback: "フィードバック",
      announcements: "お知らせ",
    },
    kanban: {
      title: "かんばん",
      backToProjects: "プロジェクトに戻る",
      addCard: "カードを追加",
      addColumn: "列を追加",
      columnName: "列名",
      cardTitle: "カードタイトル",
      cardDescription: "カード説明",
      assignee: "担当者",
      dueDate: "期限",
      create: "作成",
      cancel: "キャンセル",
      deleteCard: "カードを削除",
      deleteColumn: "列を削除",
      editCard: "カードを編集",
      save: "変更を保存",
      noCards: "まだカードがありません",
      dragCard: "列間でカードをドラッグ",
    },
    diagrams: {
      title: "フローチャート",
      createNew: "新しい図を作成",
      noDiagrams: "まだ図がありません",
      noDiagramsDesc: "最初のフローチャートを作成してプロセスを可視化",
      diagramName: "図の名前",
      description: "説明",
      create: "作成",
      edit: "編集",
      delete: "削除",
      confirmDelete: "本当にこの図を削除しますか？",
      cancel: "å–æ¶ˆ",
      save: "ä¿å­˜",
      addNode: "æ·»åŠ èŠ‚ç‚¹",
      addConnection: "æ·»åŠ è¿žæŽ¥",
      nodeTypes: {
        start: "å¼€å§‹",
        process: "è¿‡ç¨‹",
        decision: "å†³ç­–",
        end: "ç»“æŸ",
        data: "æ•°æ®",
      },
      tools: {
        select: "é€‰æ‹©",
        move: "ç§»åŠ¨",
        delete: "åˆ é™¤",
        connect: "è¿žæŽ¥",
      },
      exportImage: "å¯¼å‡ºä¸ºå›¾ç‰‡",
      exportJSON: "å¯¼å‡ºä¸ºJSON",
      clear: "清空画布",
      zoom: "ç¼©æ”¾",
      editLabel: ""
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
    },
  },
  ja: {
    nav: {
      home: "›¼ ",
      dashboard: "ダッシュボード",
      projects: "—­â‚¸â‚§â‚¯ˆ",
      aiTools: "AI„¼«",
      community: "â‚³Ÿ¥‹†â‚£",
      settings: "è¨­å®š",
      signIn: "­â‚°â‚¤³",
      signUp: "ç™»éŒ²",
      signOut: "­â‚°â‚¢â‚¦ˆ",
      todo: "â‚¿â‚¹â‚¯",
      meeting: "Ÿ¼†â‚£³â‚°",
      planning: "è¨ˆç”»",
      diagrams: "•­¼å›³",
    },
    auth: {
      signIn: "­â‚°â‚¤³",
      signUp: "ç™»éŒ²",
      email: "¡¼«",
      password: "‘â‚¹¯¼‰",
      name: "åå‰",
      createAccount: "â‚¢â‚«â‚¦³ˆä½œæˆ",
      alreadyHaveAccount: "â‚¢â‚«â‚¦³ˆâ‚’âŠæŒâ¡â§â™â‹ï¼Ÿ",
      dontHaveAccount: "â‚¢â‚«â‚¦³ˆâ‚’âŠæŒâ¡â§âªâ„â§â™â‹ï¼Ÿ",
      signInButton: "­â‚°â‚¤³",
      signUpButton: "ç™»éŒ²",
      rememberMe: "­â‚°â‚¤³çŠ¶æ…‹â‚’ä¿æŒ",
    },
    dashboard: {
      welcomeBack: "âŠâ‹âˆâ‚Šâªâ•â„",
      happeningToday: "今日のプロジェクトの状況です。",
      loading: "èª­â¿è¾¼â¿ä¸­...",
      activeUsers: "â‚¢â‚¯†â‚£–¦¼â‚¶¼",
      totalBuilds: "ç·“«‰æ•°",
      repositories: "ªâ‚¸ˆª",
      apiCalls: "APIå‘¼â³å‡ºâ—",
      recentProjects: "æœ€è¿‘â®—­â‚¸â‚§â‚¯ˆ",
      aiAssistant: "AIâ‚¢â‚·â‚¹â‚¿³ˆ",
      systemStatus: "â‚·â‚¹† â‚¹†¼â‚¿â‚¹",
      askAnything: "ä½•â§â‚‚èžâ„â¦ââ â•â„...",
      send: "é€ä¿¡",
      allSystemsOperational: "全システムが稼働中",
      buildsInProgress: "å€‹â®“«‰âŒé€²è¡Œä¸­",
      connectedAndHealthy: "æŽ¥ç¶šæ¸ˆâ¿â§æ­£å¸¸",
    },
    settings: {
      title: "設定",
      subtitle: "アカウントと設定を管理",
      profile: "プロフィール",
      username: "ユーザー名",
      email: "メール",
      userId: "ユーザーID",
      memberSince: "メンバー登録日",
      saveChanges: "変更を保存",
      notifications: "通知",
      emailNotifications: "メール通知",
      emailNotificationsDesc: "プロジェクトの更新を受け取る",
      buildNotifications: "ビルド通知",
      buildNotificationsDesc: "ビルドが完了したら通知を受け取る",
      meetingNotifications: "会議の通知",
      meetingNotificationsDesc: "近日開催の会議について通知を受け取る",
      avatar: "プロフィール写真",
      uploadAvatar: "写真をアップロード",
  removeAvatar: "削除",
  bio: "自己紹介",
      security: "セキュリティ",
      currentPassword: "現在のパスワード",
      newPassword: "新しいパスワード",
      updatePassword: "パスワードを更新",
      appearance: "外観",
      theme: "テーマ",
      darkMode: "ダークモード",
      lightMode: "ライトモード",
      currentTheme: "現在のテーマ",
      comingSoon: "近日公開",
      language: "言語",
      selectLanguage: "使用する言語を選択",
      dangerZone: "危険ゾーン",
      dangerZoneDesc: "元に戻せない操作でアカウントに永続的な影響があります",
      deleteAccount: "アカウントを削除",
    },
    notifications: {
      title: "通知",
      noUpcoming: "今後の会議はありません",
      startsIn: "開始時刻",
    },
    landing: {
      hero: {
        title: "考える。コード。テスト。出荷。",
        subtitle: "構築、学習、協力する開発者のための究極のプラットフォーム。",
        cta: "Lab68â«å…¥â‚‹",
      },
      mission: {
        title: "ç§âŸâ¡â®ä½¿å‘½",
        description:
          "Lab68â¯â€å½¢å¼â‚ˆâ‚Šâ‚‚æ©Ÿèƒ½â‚’é‡è¦–â™â‚‹äººâ€…â®âŸâ‚â«è¨­è¨ˆâ•â‚ŒâŸ–«¼â‚¿ªâ‚¹ˆé–‹ç™ºè€…—©ƒˆ•â‚©¼ â§â™â€‚å„ªâ‚ŒâŸâ‚½•ˆâ‚¦â‚§â‚¢â‚’æ§‹ç¯‰â™â‚‹âŸâ‚â«å¿…è¦âª„¼«â€â‚³Ÿ¥‹†â‚£â€ªâ‚½¼â‚¹â‚’æä¾›â—â¾â™â€‚",
      },
      techStack: {
        title: "技術スタック",
      },
      community: {
        title: "â‚³Ÿ¥‹†â‚£â«å‚åŠ ",
        description: "世界中の開発者とつながる。知識を共有する。一緒に構築する。",
      },
    },
    todo: {
      title: "â‚¿â‚¹â‚¯",
      subtitle: "â‚¿â‚¹â‚¯â‚’ç®¡ç†â—â¦æ•´ç†æ•´é “",
      addTask: "â‚¿â‚¹â‚¯â‚’è¿½åŠ ",
      taskName: "â‚¿â‚¹â‚¯å",
      taskDescription: "â‚¿â‚¹â‚¯â®èª¬æ˜Ž",
      priority: "å„ªå…ˆåº¦",
      low: "ä½Ž",
      medium: "ä¸­",
      high: "é«˜",
      create: "â‚¿â‚¹â‚¯â‚’ä½œæˆ",
      noTasks: "â¾â â‚¿â‚¹â‚¯âŒâ‚â‚Šâ¾â›â‚“",
      startAdding: "â‚¿â‚¹â‚¯â‚’è¿½åŠ â—â¦æ•´ç†æ•´é “â‚’å§‹â‚â¾â—â‚‡â†",
      completed: "å®Œäº†",
      pending: "ä¿ç•™ä¸­",
      markComplete: "å®Œäº†â¨â—â¦ž¼â‚¯",
      markIncomplete: "æœªå®Œäº†â¨â—â¦ž¼â‚¯",
      delete: "å‰Šé™¤",
    },
    meeting: {
      title: "Ÿ¼†â‚£³â‚°",
      subtitle: "Ÿ¼†â‚£³â‚°â‚’â‚¹â‚±â‚¸¥¼«â—â¦ç®¡ç†",
      scheduleMeeting: "Ÿ¼†â‚£³â‚°â‚’â‚¹â‚±â‚¸¥¼«",
      meetingTitle: "Ÿ¼†â‚£³â‚°â®â‚¿â‚¤ˆ«",
      meetingDescription: "Ÿ¼†â‚£³â‚°â®èª¬æ˜Ž",
      date: "æ—¥ä»˜",
      time: "æ™‚é–“",
      duration: "æœŸé–“",
      minutes: "åˆ†",
      schedule: "Ÿ¼†â‚£³â‚°â‚’â‚¹â‚±â‚¸¥¼«",
      noMeetings: "â‚¹â‚±â‚¸¥¼«â•â‚ŒâŸŸ¼†â‚£³â‚°â¯â‚â‚Šâ¾â›â‚“",
      startScheduling: "Ÿ¼†â‚£³â‚°â‚’â‚¹â‚±â‚¸¥¼«â—â¦æ•´ç†æ•´é “â‚’å§‹â‚â¾â—â‚‡â†",
      upcoming: "ä»Šå¾Œ",
      past: "éŽåŽ»",
      cancel: "Ÿ¼†â‚£³â‚°â‚’â‚­£³â‚»«",
    },
    planning: {
      title: "è¨ˆç”»",
      subtitle: "—­â‚¸â‚§â‚¯ˆâ‚’è¨ˆç”»â—â¦è¿½è·¡",
      createPlan: "è¨ˆç”»â‚’ä½œæˆ",
      planName: "è¨ˆç”»å",
      planDescription: "è¨ˆç”»â®èª¬æ˜Ž",
      startDate: "é–‹å§‹æ—¥",
      endDate: "çµ‚äº†æ—¥",
      status: "â‚¹†¼â‚¿â‚¹",
      notStarted: "æœªé–‹å§‹",
      inProgress: "é€²è¡Œä¸­",
      completed: "å®Œäº†",
      create: "è¨ˆç”»â‚’ä½œæˆ",
      noPlans: "â¾â è¨ˆç”»âŒâ‚â‚Šâ¾â›â‚“",
      startPlanning: "—­â‚¸â‚§â‚¯ˆâ®è¨ˆç”»â‚’å§‹â‚â¾â—â‚‡â†",
      addMilestone: "žâ‚¤«â‚¹ˆ¼³â‚’è¿½åŠ ",
      milestoneName: "žâ‚¤«â‚¹ˆ¼³å",
      milestoneDate: "žâ‚¤«â‚¹ˆ¼³â®æ—¥ä»˜",
      delete: "å‰Šé™¤",
    },
    projects: {
      title: "—­â‚¸â‚§â‚¯ˆ",
      subtitle: "é–‹ç™º—­â‚¸â‚§â‚¯ˆâ‚’ç®¡ç†âŠâ‚ˆâ³ç›£è¦–",
      newProject: "æ–°â—â„—­â‚¸â‚§â‚¯ˆ",
      projectName: "—­â‚¸â‚§â‚¯ˆå",
      projectDescription: "—­â‚¸â‚§â‚¯ˆâ®èª¬æ˜Ž",
      technologies: "æŠ€è¡“ï¼ˆâ‚«³žåŒºåˆ‡â‚Šï¼‰",
      status: "â‚¹†¼â‚¿â‚¹",
      active: "â‚¢â‚¯†â‚£–",
      building: "æ§‹ç¯‰ä¸­",
      inProgress: "é€²è¡Œä¸­",
      create: "—­â‚¸â‚§â‚¯ˆâ‚’ä½œæˆ",
      noProjects: "â¾â —­â‚¸â‚§â‚¯ˆâŒâ‚â‚Šâ¾â›â‚“",
      startCreating: "—­â‚¸â‚§â‚¯ˆâ‚’ä½œæˆâ—â¦ä½œæ¥­â‚’è¿½è·¡â—â¾â—â‚‡â†",
      lastUpdated: "æœ€çµ‚æ›´æ–°",
      edit: "ç·¨é›†",
      delete: "å‰Šé™¤",
      cancel: "â‚­£³â‚»«",
      save: "å¤‰æ›´â‚’ä¿å­˜",
      editProject: "—­â‚¸â‚§â‚¯ˆâ‚’ç·¨é›†",
      kanban: "â‚«³³œ¼‰",
      viewKanban: "â‚«³³â‚’è¡¨ç¤º",
      collaborators: "âコラボレ¼â‚¿¼",
      addCollaborator: "âコラボレ¼â‚¿¼â‚’è¿½åŠ ",
      inviteByEmail: "¡¼«â§æ‹›å¾…",
      invite: "æ‹›å¾…",
      removeCollaborator: "å‰Šé™¤",
      owner: "â‚ª¼Š¼",
      noCollaborators: "â¾â âコラボレ¼â‚¿¼âŒâ„â¾â›â‚“",
      role: "役割",
      selectRole: "役割を選択",
      roleOwner: "所有者",
      roleAdmin: "管理者",
      roleEditor: "編集者",
      roleViewer: "閲覧者",
      permissions: "権限",
      canEdit: "編集可能",
      canDelete: "削除可能",
      canInvite: "招待可能",
      canManageRoles: "役割管理可能",
      canViewActivity: "活動閲覧可能",
      activity: "活動",
      recentActivity: "最近の活動",
      noActivity: "最近の活動はありません",
      lastActive: "最終アクティブ",
      addedBy: "追加者",
      changeRole: "役割を変更",
      member: "メンバー",
      members: "メンバー",
    },
    community: {
      title: "â‚³Ÿ¥‹†â‚£",
      subtitle: "開発者とつながり、知識を共有し、協力する",
      newDiscussion: "新しいディスカッション",
      discussionTitle: "ディスカッションのタイトル",
      discussionContent: "何を考えていますか？",
      category: "カテゴリー",
      selectCategory: "カテゴリーを選択",
      customCategory: "カスタムカテゴリー名",
      post: "ディスカッションを投稿",
      noDiscussions: "まだディスカッションがありません",
      startDiscussion: "最初にディスカッションを始めましょう",
      replies: "è¿”ä¿¡",
      by: "æŠ•ç¨¿è€…",
      cancel: "â‚­£³â‚»«",
      general: "ä¸€èˆ¬",
      help: "˜«—",
      showcase: "â‚·§¼â‚±¼â‚¹",
      feedback: "Feedback",
      announcements: "âŠçŸ¥â‚‰â›",
    },
    kanban: {
      title: "â‚«³³œ¼‰",
      backToProjects: "—­â‚¸â‚§â‚¯ˆâ«æˆ»â‚‹",
      addCard: "â‚«¼‰â‚’è¿½åŠ ",
      addColumn: "åˆ—â‚’è¿½åŠ ",
      columnName: "åˆ—å",
      cardTitle: "â‚«¼‰â‚¿â‚¤ˆ«",
      cardDescription: "â‚«¼‰â®èª¬æ˜Ž",
      assignee: "æ‹…å½“è€…",
      dueDate: "æœŸé™",
      create: "ä½œæˆ",
      cancel: "â‚­£³â‚»«",
      deleteCard: "â‚«¼‰â‚’å‰Šé™¤",
      deleteColumn: "åˆ—â‚’å‰Šé™¤",
      editCard: "â‚«¼‰â‚’ç·¨é›†",
      save: "å¤‰æ›´â‚’ä¿å­˜",
      noCards: "â¾â â‚«¼‰âŒâ‚â‚Šâ¾â›â‚“",
      dragCard: "Arraste um cartão para outro status...",
    },
    diagrams: {
      title: "•­¼å›³",
      createNew: "æ–°â—â„å›³â‚’ä½œæˆ",
      noDiagrams: "â¾â å›³âŒâ‚â‚Šâ¾â›â‚“",
      noDiagramsDesc: "æœ€åˆâ®•­¼£¼ˆâ‚’ä½œæˆâ—â¦—­â‚»â‚¹â‚’è¦–è¦šåŒ–â—â¾â—â‚‡â†",
      diagramName: "å›³â®åå‰",
      description: "èª¬æ˜Ž",
      create: "ä½œæˆ",
      edit: "ç·¨é›†",
      delete: "å‰Šé™¤",
      confirmDelete: "â“â®å›³â‚’å‰Šé™¤â—â¦â‚‚â‚ˆâ‚â—â„â§â™â‹ï¼Ÿ",
      cancel: "â‚­£³â‚»«",
      save: "ä¿å­˜",
      addNode: "Ž¼‰â‚’è¿½åŠ ",
      addConnection: "æŽ¥ç¶šâ‚’è¿½åŠ ",
      nodeTypes: {
        start: "é–‹å§‹",
        process: "—­â‚»â‚¹",
        decision: "åˆ¤æ–­",
        end: "çµ‚äº†",
        data: "‡¼â‚¿",
      },
      tools: {
        select: "é¸æŠž",
        move: "ç§»å‹•",
        delete: "å‰Šé™¤",
        connect: "æŽ¥ç¶š",
      },
      exportImage: "Exportar Imagem",
      exportJSON: "JSONâ¨â—â¦â‚¨â‚¯â‚¹¼ˆ",
      clear: "â‚­£³â‚¹â‚’â‚¯ªâ‚¢",
      zoom: "â‚º¼ ",
      editLabel: ""
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
    },
  },
  pt: {
    nav: {
      home: "Inâcio",
      dashboard: "Painel",
      projects: "Projetos",
      aiTools: "Ferramentas IA",
      community: "Comunidade",
      settings: "Configuraçâµes",
      signIn: "Entrar",
      signUp: "Cadastrar",
      signOut: "Sair",
      todo: "Tarefas",
      meeting: "Reuniâµes",
      planning: "Planejamento",
      diagrams: "Fluxo e Diagramas",
    },
    auth: {
      signIn: "Entrar",
      signUp: "Cadastrar",
      email: "Email",
      password: "Senha",
      name: "Nome",
      createAccount: "Criar Conta",
      alreadyHaveAccount: "Já tem uma conta?",
      dontHaveAccount: "Nâ£o tem uma conta?",
      signInButton: "Entrar",
      signUpButton: "Cadastrar",
      rememberMe: "Lembrar de mim",
    },
    dashboard: {
      welcomeBack: "Bem-vindo de volta",
      happeningToday: "Aqui está o que está acontecendo com seus projetos hoje.",
      loading: "Carregando...",
      activeUsers: "Usuários Ativos",
      totalBuilds: "Builds Totais",
      repositories: "Repositiórios",
      apiCalls: "Chamadas API",
      recentProjects: "Projetos Recentes",
      aiAssistant: "Assistente IA",
      systemStatus: "Status do Sistema",
      askAnything: "Pergunte-me qualquer coisa...",
      send: "Enviar",
      allSystemsOperational: "Todos os sistemas operacionais",
      buildsInProgress: "builds em andamento",
      connectedAndHealthy: "Conectado e saudável",
    },
    settings: {
      title: "Configuraçâµes",
      subtitle: "Gerencie sua conta e preferâªncias",
      profile: "Perfil",
      username: "Nome de Usuário",
      email: "Email",
      userId: "ID do Usuário",
      memberSince: "Membro Desde",
      saveChanges: "Salvar Alteraçâµes",
      notifications: "Notificaçâµes",
      emailNotifications: "Notificaçâµes por Email",
      emailNotificationsDesc: "Receba atualizaçâµes sobre seus projetos",
      buildNotifications: "Notificaçâµes de Build",
      buildNotificationsDesc: "Seja notificado quando os builds forem concluâdos",
      meetingNotifications: "Meeting Notifications",
      meetingNotificationsDesc: "Get notified about upcoming meetings",
      avatar: "Profile Picture",
      uploadAvatar: "Upload Photo",
  removeAvatar: "Remove",
  bio: "Biografia",
      security: "Segurança",
      currentPassword: "Senha Atual",
      newPassword: "Nova Senha",
      updatePassword: "Atualizar Senha",
      appearance: "Aparâªncia",
      theme: "Tema",
      darkMode: "Modo Escuro",
      lightMode: "Modo Claro",
      currentTheme: "Tema atual",
      comingSoon: "Em breve",
      language: "Idioma",
      selectLanguage: "Selecione seu idioma preferido",
      dangerZone: "Zona de Perigo",
      dangerZoneDesc: "Açâµes irreversâveis que afetarâ£o permanentemente sua conta",
      deleteAccount: "Excluir Conta",
    },
    notifications: {
      title: "Notificações",
      noUpcoming: "Nenhuma reuniâo futura",
      startsIn: "Começa em",
    },
    landing: {
      hero: {
        title: "Pense. Codifique. Teste. Envie.",
        subtitle: "A plataforma definitiva para desenvolvedores que constroem, aprendem e colaboram.",
        cta: "Entrar no Lab68",
      },
      mission: {
        title: "Nossa Missâ£o",
        description:
          "Lab68 é uma plataforma de desenvolvimento brutalista projetada para aqueles que valorizam a funçâ£o sobre a forma. Fornecemos as ferramentas, a comunidade e os recursos necessários para construir software excepcional.",
      },
      techStack: {
        title: "Stack Tecnológico",
      },
      community: {
        title: "Junte-se â  Comunidade",
        description: "Conecte-se com desenvolvedores em todo o mundo. Compartilhe conhecimento. Construa juntos.",
      },
    },
    todo: {
      title: "Tarefas",
      subtitle: "Gerencie suas tarefas e mantenha-se organizado",
      addTask: "Adicionar Tarefa",
      taskName: "Nome da Tarefa",
      taskDescription: "Descriçâ£o da Tarefa",
      priority: "Prioridade",
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      create: "Criar Tarefa",
      noTasks: "Ainda nâ£o há tarefas",
      startAdding: "Comece a adicionar tarefas para se manter organizado",
      completed: "Concluâdas",
      pending: "Pendentes",
      markComplete: "Marcar como Concluâda",
      markIncomplete: "Marcar como Incompleta",
      delete: "Excluir",
    },
    meeting: {
      title: "Reuniâµes",
      subtitle: "Agende e gerencie suas reuniâµes",
      scheduleMeeting: "Agendar Reuniâ£o",
      meetingTitle: "Título da Reuniâ£o",
      meetingDescription: "Descriçâ£o da Reuniâ£o",
      date: "Data",
      time: "Hora",
      duration: "Duraçâ£o",
      minutes: "minutos",
      schedule: "Agendar Reuniâ£o",
      noMeetings: "Nenhuma reuniâ£o agendada",
      startScheduling: "Comece a agendar reuniâµes para se manter organizado",
      upcoming: "Prióximas",
      past: "Passadas",
      cancel: "Cancelar Reuniâ£o",
    },
    planning: {
      title: "Planejamento",
      subtitle: "Planeje e acompanhe seus projetos",
      createPlan: "Criar Plano",
      planName: "Nome do Plano",
      planDescription: "Descriçâ£o do Plano",
      startDate: "Data de Inâcio",
      endDate: "Data de Término",
      status: "Status",
      notStarted: "Nâ£o Iniciado",
      inProgress: "Em Andamento",
      completed: "Concluâdo",
      create: "Criar Plano",
      noPlans: "Ainda nâ£o há planos",
      startPlanning: "Comece a planejar seus projetos",
      addMilestone: "Adicionar Marco",
      milestoneName: "Nome do Marco",
      milestoneDate: "Data do Marco",
      delete: "Excluir",
    },
    projects: {
      title: "Projetos",
      subtitle: "Gerencie e monitore seus projetos de desenvolvimento",
      newProject: "Novo Projeto",
      projectName: "Nome do Projeto",
      projectDescription: "Descriçâ£o do Projeto",
      technologies: "Tecnologias (separadas por vârgula)",
      status: "Status",
      active: "Ativo",
      building: "Construindo",
      inProgress: "Em Andamento",
      create: "Criar Projeto",
      noProjects: "Ainda nâ£o há projetos",
      startCreating: "Comece a criar projetos para rastrear seu trabalho",
      lastUpdated: "Última atualizaçâ£o",
      edit: "Editar",
      delete: "Excluir",
      cancel: "Cancelar",
      save: "Salvar Alteraçâµes",
      editProject: "Editar Projeto",
      kanban: "Quadro Kanban",
      viewKanban: "Ver Kanban",
      collaborators: "Colaboradores",
      addCollaborator: "Adicionar Colaborador",
      inviteByEmail: "Convidar por email",
      invite: "Convidar",
      removeCollaborator: "Remover",
      owner: "Proprietário",
      noCollaborators: "Ainda nâ£o há colaboradores",
      role: "Função",
      selectRole: "Selecionar função",
      roleOwner: "Proprietário",
      roleAdmin: "Administrador",
      roleEditor: "Editor",
      roleViewer: "Observador",
      permissions: "Permissões",
      canEdit: "Pode editar",
      canDelete: "Pode excluir",
      canInvite: "Pode convidar",
      canManageRoles: "Pode gerenciar funções",
      canViewActivity: "Pode ver atividade",
      activity: "Atividade",
      recentActivity: "Atividade Recente",
      noActivity: "Sem atividade recente",
      lastActive: "Última atividade",
      addedBy: "Adicionado por",
      changeRole: "Mudar Função",
      member: "membro",
      members: "membros",
    },
    community: {
      title: "Comunidade",
      subtitle: "Conecte-se com desenvolvedores, compartilhe conhecimento e colabore",
      newDiscussion: "Nova Discussâ£o",
      discussionTitle: "Título da Discussâ£o",
      discussionContent: "O que vocâª está pensando?",
      category: "Categoria",
      selectCategory: "Selecione uma categoria",
      customCategory: "Nome da Categoria Personalizada",
      post: "Publicar Discussâ£o",
      noDiscussions: "Ainda nâ£o há discussâµes",
      startDiscussion: "Seja o primeiro a iniciar uma discussâ£o",
      replies: "respostas",
      by: "por",
      cancel: "Cancelar",
      general: "Geral",
      help: "Ajuda",
      showcase: "Vitrine",
      feedback: "Feedback",
      announcements: "Anúncios",
    },
    kanban: {
      title: "Quadro Kanban",
      backToProjects: "Voltar aos Projetos",
      addCard: "Adicionar Cartâ£o",
      addColumn: "Adicionar Coluna",
      columnName: "Nome da Coluna",
      cardTitle: "Título do Cartâ£o",
      cardDescription: "Descriçâ£o do Cartâ£o",
      assignee: "Atribuâdo a",
      dueDate: "Data de Vencimento",
      create: "Criar",
      cancel: "Cancelar",
      deleteCard: "Excluir Cartâ£o",
      deleteColumn: "Excluir Coluna",
      editCard: "Editar Cartâ£o",
      save: "Salvar Alteraçâµes",
      noCards: "Ainda nâ£o há cartâµes",
      dragCard: "Arraste cartâµes entre colunas",
    },
    diagrams: {
      title: "Fluxo e Diagramas",
      createNew: "Criar Novo Diagrama",
      noDiagrams: "Ainda nâ£o há diagramas",
      noDiagramsDesc: "Crie seu primeiro fluxograma para visualizar seus processos",
      diagramName: "Nome do Diagrama",
      description: "Descriçâ£o",
      create: "Criar",
      edit: "Editar",
      delete: "Excluir",
      confirmDelete: "Tem certeza de que deseja excluir este diagrama?",
      cancel: "Cancelar",
      save: "Salvar",
      addNode: "Adicionar Nió",
      addConnection: "Adicionar Conexâ£o",
      nodeTypes: {
        start: "Inâcio",
        process: "Processo",
        decision: "Decisâ£o",
        end: "Fim",
        data: "Dados",
      },
      tools: {
        select: "Selecionar",
        move: "Mover",
        delete: "Excluir",
        connect: "Conectar",
      },
      exportImage: "Exportar como Imagem",
      exportJSON: "Exportar como JSON",
      clear: "Limpar Tela",
      zoom: "Zoom",
      editLabel: ""
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
    },
  },
  ru: {
    nav: {
      home: "Главная",
      dashboard: "Панель",
      projects: "Проекты",
      aiTools: "ИИ Инструменты",
      community: "Сообщество",
      settings: "Настройки",
      signIn: "Войти",
      signUp: "Регистрация",
      signOut: "Выйти",
      todo: "Задачи",
      meeting: "Встречи",
      planning: "Планирование",
      diagrams: "Блок-схемы",
    },
    auth: {
      signIn: "Войти",
      signUp: "Регистрация",
      email: "Электронная почта",
      password: "Пароль",
      name: "Имя",
      createAccount: "Создать аккаунт",
      alreadyHaveAccount: "Уже есть аккаунт?",
      dontHaveAccount: "Нет аккаунта?",
      signInButton: "Войти",
      signUpButton: "Регистрация",
      rememberMe: "Запомнить меня",
    },
    dashboard: {
      welcomeBack: "С возвращением",
      happeningToday: "Вот что происходит с вашими проектами сегодня",
      loading: "Загрузка...",
      activeUsers: "Активные Пользователи",
      totalBuilds: "Всего Сборок",
      repositories: "Репозитории",
      apiCalls: "API вызовы",
      recentProjects: "Недавние проекты",
      aiAssistant: "ИИ Ассистент",
      systemStatus: "Статус системы",
      askAnything: "Спросите меня о чем угодно...",
      send: "Отправить",
      allSystemsOperational: "Все системы работают",
      buildsInProgress: "сборок в процессе",
      connectedAndHealthy: "Подключено и работает",
    },
    settings: {
      title: "Настройки",
      subtitle: "Управление настройками учетной записи и предпочтениями",
      profile: "Профиль",
      username: "Имя пользователя",
      email: "Email",
      bio: "Биография",
      bioPlaceholder: "Расскажите о себе...",
      avatar: "Аватар",
      uploadAvatar: "Загрузить Аватар",
      removeAvatar: "Удалить Аватар",
      notifications: "Уведомления",
      emailNotifications: "Email уведомления",
      emailNotificationsDesc: "Получайте обновления о ваших проектах",
      buildNotifications: "Уведомления о сборках",
      buildNotificationsDesc: "Уведомлять о завершении сборок",
      meetingNotifications: "Уведомления о встречах",
      meetingNotificationsDesc: "Напоминания о предстоящих встречах",
      language: "Язык",
      selectLanguage: "Выберите предпочитаемый язык",
      theme: "Тема",
      lightMode: "Светлая",
      darkMode: "Темная",
      privacy: "Конфиденциальность",
      showEmail: "Показать email публично",
      showActivity: "Показать активность",
      showProfile: "Сделать профиль публичным",
      security: "Безопасность",
      changePassword: "Изменить пароль",
      currentPassword: "Текущий пароль",
      newPassword: "Новый пароль",
      confirmPassword: "Подтвердите пароль",
      updatePassword: "Обновить пароль",
      twoFactor: "Двухфакторная аутентификация",
      enable2FA: "Включить 2FA",
      saveChanges: "Сохранить изменения",
      cancel: "Отмена",
    },
    landing: {
      hero: "lab68dev.",
      title: "Думай. Кодируй. Тестируй. Развертывай.",
      subtitle: "Идеальная платформа для разработчиков для создания, обучения и сотрудничества",
      getStarted: "Начать",
      learnMore: "Узнать больше",
    },
    todo: {
      title: "Задачи",
      subtitle: "Управляйте задачами и оставайтесь организованными",
      newTask: "Новая задача",
      taskTitle: "Название задачи",
      addTask: "Добавить задачу",
      completed: "Завершено",
      active: "Активные",
      clearCompleted: "Очистить завершенные",
      noTasks: "Задач пока нет",
      startAdding: "Начните добавлять задачи, чтобы оставаться организованными",
    },
    meeting: {
      title: "Встречи",
      subtitle: "Планируйте и управляйте своими встречами",
      newMeeting: "Новая встреча",
      meetingTitle: "Название встречи",
      meetingDescription: "Описание встречи",
      date: "Дата",
      time: "Время",
      create: "Создать встречу",
      cancel: "Отмена",
      noMeetings: "Встреч пока нет",
      startScheduling: "Начните планировать встречи, чтобы оставаться организованными",
      upcoming: "Предстоящие",
      past: "Прошедшие",
    },
    notifications: {
      title: "Уведомления",
      noUpcoming: "Нет предстоящих встреч",
      startsIn: "Начинается через",
    },
    projects: {
      title: "Проекты",
      subtitle: "Управление и мониторинг ваших проектов разработки",
      newProject: "Новый проект",
      projectName: "Название проекта",
      projectDescription: "Описание проекта",
      technologies: "Технологии (через запятую)",
      status: "Статус",
      active: "Активный",
      building: "В разработке",
      inProgress: "В процессе",
      create: "Создать проект",
      noProjects: "Проектов пока нет",
      startCreating: "Начните создавать проекты для отслеживания работы",
      lastUpdated: "Последнее обновление",
      edit: "Редактировать",
      delete: "Удалить",
      cancel: "Отмена",
      save: "Сохранить изменения",
      editProject: "Редактировать проект",
      kanban: "Канбан доска",
      viewKanban: "Посмотреть канбан",
      collaborators: "Участники",
      addCollaborator: "Добавить участника",
      inviteByEmail: "Пригласить по email",
      invite: "Пригласить",
      removeCollaborator: "Удалить",
      owner: "Владелец",
      noCollaborators: "Пока нет сотрудников",
      role: "Роль",
      selectRole: "Выбрать роль",
      roleOwner: "Владелец",
      roleAdmin: "Администратор",
      roleEditor: "Редактор",
      roleViewer: "Наблюдатель",
      permissions: "Разрешения",
      canEdit: "Может редактировать",
      canDelete: "Может удалять",
      canInvite: "Может приглашать",
      canManageRoles: "Может управлять ролями",
      canViewActivity: "Может просматривать активность",
      activity: "Активность",
      recentActivity: "Последняя Активность",
      noActivity: "Нет недавней активности",
      lastActive: "Последняя активность",
      addedBy: "Добавлено",
      changeRole: "Изменить Роль",
      member: "участник",
      members: "участники",
    },
    community: {
      title: "Сообщество",
      subtitle: "Общайтесь с разработчиками, делитесь знаниями и сотрудничайте",
      newDiscussion: "Новое Обсуждение",
      discussionTitle: "Название Обсуждения",
      discussionContent: "О чем вы думаете?",
      category: "Категория",
      selectCategory: "Выберите категорию",
      customCategory: "Название Пользовательской Категории",
      post: "Опубликовать обсуждение",
      noDiscussions: "Обсуждений пока нет",
      startDiscussion: "Будьте первым, кто начнет обсуждение",
      replies: "ответов",
      by: "от",
      cancel: "Отмена",
      general: "Общее",
      help: "Помощь",
      showcase: "Витрина",
      feedback: "Отзывы",
      announcements: "Объявления",
    },
    kanban: {
      title: "Канбан доска",
      backToProjects: "Назад к проектам",
      addCard: "Добавить карточку",
      addColumn: "Добавить колонку",
      columnName: "Название колонки",
      cardTitle: "Название карточки",
      cardDescription: "Описание карточки",
      assignee: "Исполнитель",
      dueDate: "Срок",
      create: "Создать",
      cancel: "Отмена",
      deleteCard: "Удалить карточку",
      deleteColumn: "Удалить колонку",
      editCard: "Редактировать карточку",
      save: "Сохранить",
      noCards: "Пока нет карточек",
      dragCard: "Перетащите карточки между колонками",
    },
    diagrams: {
      title: "Блок-схемы и Диаграммы",
      subtitle: "Создавайте блок-схемы, диаграммы и визуализации",
      newDiagram: "Новая диаграмма",
      diagramName: "Название диаграммы",
      createDiagram: "Создать диаграмму",
      cancel: "Отмена",
      noDiagrams: "Диаграмм пока нет",
      startCreating: "Начните создавать диаграммы для визуализации идей",
      exportImage: "Экспортировать изображение",
      exportJSON: "Экспортировать JSON",
      clear: "Очистить холст",
      zoom: "Масштаб",
      editLabel: ""
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
    },
  },
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
      hero: "lab68dev.",
      title: "Suy nghĩ. Mã hóa. Kiểm tra. Triển khai.",
      subtitle: "Nền tảng tối ưu cho các nhà phát triển để xây dựng, học tập và cộng tác",
      getStarted: "Bắt đầu",
      learnMore: "Tìm hiểu thêm",
    },
    todo: {
      title: "Việc cần làm",
      subtitle: "Quản lý công việc và luôn có tổ chức",
      newTask: "Nhiệm vụ mới",
      taskTitle: "Tiêu đề nhiệm vụ",
      addTask: "Thêm nhiệm vụ",
      completed: "Hoàn thành",
      active: "Hoạt động",
      clearCompleted: "Xóa đã hoàn thành",
      noTasks: "Chưa có nhiệm vụ nào",
      startAdding: "Bắt đầu thêm nhiệm vụ để luôn có tổ chức",
    },
    meeting: {
      title: "Cuộc họp",
      subtitle: "Lên lịch và quản lý các cuộc họp của bạn",
      newMeeting: "Cuộc họp mới",
      meetingTitle: "Tiêu đề cuộc họp",
      meetingDescription: "Mô tả cuộc họp",
      date: "Ngày",
      time: "Thời gian",
      create: "Tạo cuộc họp",
      cancel: "Hủy",
      noMeetings: "Chưa có cuộc họp nào",
      startScheduling: "Bắt đầu lên lịch các cuộc họp để luôn có tổ chức",
      upcoming: "Sắp tới",
      past: "Quá khứ",
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
      recentActivity: "Hoạt Động Gần Đây",
      noActivity: "Không có hoạt động gần đây",
      lastActive: "Hoạt động lần cuối",
      addedBy: "Được thêm bởi",
      changeRole: "Thay Đổi Vai Trò",
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
      subtitle: "Tạo sơ đồ luồng, sơ đồ và hình ảnh trực quan",
      newDiagram: "Sơ đồ mới",
      diagramName: "Tên sơ đồ",
      createDiagram: "Tạo sơ đồ",
      cancel: "Hủy",
      noDiagrams: "Chưa có sơ đồ nào",
      startCreating: "Bắt đầu tạo sơ đồ để hình dung ý tưởng của bạn",
      exportImage: "Xuất Hình Ảnh",
      exportJSON: "Xuất JSON",
      clear: "Xóa Canvas",
      zoom: "Thu Phóng",
      editLabel: "",
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
      architecture: "Architecture",
    },
    wiki: {
      title: "Wiki & Knowledge",
      subtitle: "Collaborative knowledge base and documentation",
      newPage: "New Page",
      pageName: "Page Name",
      pageContent: "Page Content",
      create: "Create Page",
      cancel: "Cancel",
      noPages: "No wiki pages yet",
      startWriting: "Create your first wiki page to document your knowledge",
      createdBy: "Created by",
      lastEdited: "Last edited",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      editPage: "Edit Page",
      search: "Search wiki...",
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
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    zh: "中文",
    ja: "日本語",
    pt: "Português",
    ru: "Русский",
    vi: "Tiếng Việt", // Added Vietnamese language name
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

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
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








