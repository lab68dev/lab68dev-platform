const fs = require('fs');

const replacement = `files: {
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
    },`;

const filePath = 'lib/i18n.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of the placeholder
content = content.replace(/files: defaultFilesTranslations,\s*wiki: defaultWikiTranslations,/g, replacement);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Replaced defaultFilesTranslations and defaultWikiTranslations with actual content!');
