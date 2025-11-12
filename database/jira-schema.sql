-- ============================================
-- JIRA-LIKE PROJECT MANAGEMENT SCHEMA
-- Lab68 Platform - Complete Database Migration
-- ============================================
-- This schema adds Jira-like project management features
-- to the existing Lab68 platform with proper RLS policies.

-- ============================================
-- SPRINTS TABLE (Created first - referenced by issues)
-- ============================================
CREATE TABLE IF NOT EXISTS public.sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'planning', -- 'planning', 'active', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CHECK (status IN ('planning', 'active', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_sprints_project ON public.sprints(project_id);
CREATE INDEX IF NOT EXISTS idx_sprints_status ON public.sprints(status);

-- ============================================
-- LABELS TABLE (Created early - referenced by issue_labels)
-- ============================================
CREATE TABLE IF NOT EXISTS public.labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6b7280',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, name)
);

CREATE INDEX IF NOT EXISTS idx_labels_project ON public.labels(project_id);

-- ============================================
-- ISSUES TABLE (Core entity - replaces basic tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Basic info
    key TEXT NOT NULL, -- e.g., "PROJ-123"
    title TEXT NOT NULL,
    description TEXT,
    
    -- Classification
    issue_type TEXT NOT NULL DEFAULT 'task', -- 'story', 'task', 'bug', 'epic', 'subtask'
    status TEXT NOT NULL DEFAULT 'backlog', -- 'backlog', 'todo', 'in-progress', 'review', 'done', 'closed'
    priority TEXT NOT NULL DEFAULT 'medium', -- 'lowest', 'low', 'medium', 'high', 'urgent'
    
    -- Assignment
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Sprint & Epic
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
    epic_id UUID REFERENCES public.issues(id) ON DELETE SET NULL, -- Self-reference for epics
    parent_id UUID REFERENCES public.issues(id) ON DELETE CASCADE, -- For subtasks
    
    -- Estimation & Scheduling
    story_points INTEGER,
    original_estimate INTEGER, -- minutes
    remaining_estimate INTEGER, -- minutes
    time_spent INTEGER DEFAULT 0, -- minutes
    due_date TIMESTAMPTZ,
    
    -- Ordering
    rank TEXT, -- LexoRank for drag-and-drop ordering
    order_index INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(project_id, key),
    CHECK (issue_type IN ('story', 'task', 'bug', 'epic', 'subtask')),
    CHECK (status IN ('backlog', 'todo', 'in-progress', 'review', 'done', 'closed', 'blocked')),
    CHECK (priority IN ('lowest', 'low', 'medium', 'high', 'urgent'))
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_issues_project ON public.issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_sprint ON public.issues(sprint_id);
CREATE INDEX IF NOT EXISTS idx_issues_epic ON public.issues(epic_id);
CREATE INDEX IF NOT EXISTS idx_issues_assignee ON public.issues(assignee_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_type ON public.issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_issues_order ON public.issues(project_id, order_index);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_internal BOOLEAN DEFAULT FALSE -- For internal team notes
);

CREATE INDEX IF NOT EXISTS idx_comments_issue ON public.issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON public.issue_comments(author_id);

-- ============================================
-- ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES auth.users(id),
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER, -- bytes
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_issue ON public.issue_attachments(issue_id);

-- ============================================
-- ISSUE_LABELS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_labels (
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
    
    PRIMARY KEY (issue_id, label_id)
);

CREATE INDEX IF NOT EXISTS idx_issue_labels_issue ON public.issue_labels(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_labels_label ON public.issue_labels(label_id);

-- ============================================
-- BOARDS TABLE (Optional - for custom board configs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Main Board',
    type TEXT NOT NULL DEFAULT 'kanban', -- 'kanban', 'scrum'
    columns JSONB NOT NULL DEFAULT '[]', -- Array of column configs
    filter JSONB DEFAULT '{}', -- Board filter config
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CHECK (type IN ('kanban', 'scrum'))
);

CREATE INDEX IF NOT EXISTS idx_boards_project ON public.boards(project_id);

-- ============================================
-- WORKLOGS TABLE (Time tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.worklogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id),
    time_spent INTEGER NOT NULL, -- minutes
    started_at TIMESTAMPTZ NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_worklogs_issue ON public.worklogs(issue_id);
CREATE INDEX IF NOT EXISTS idx_worklogs_author ON public.worklogs(author_id);

-- ============================================
-- ISSUE_WATCHERS (Users watching issues)
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_watchers (
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (issue_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_watchers_issue ON public.issue_watchers(issue_id);
CREATE INDEX IF NOT EXISTS idx_watchers_user ON public.issue_watchers(user_id);

-- ============================================
-- ACTIVITY_LOG (Issue history/audit trail)
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- 'created', 'updated', 'commented', 'status_changed', etc.
    field_name TEXT, -- What was changed
    old_value TEXT,
    new_value TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_issue ON public.issue_activity(issue_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON public.issue_activity(created_at);

-- ============================================
-- ISSUE_LINKS (Link related issues)
-- ============================================
CREATE TABLE IF NOT EXISTS public.issue_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    target_issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    link_type TEXT NOT NULL, -- 'blocks', 'is_blocked_by', 'duplicates', 'relates_to', 'causes', 'is_caused_by'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CHECK (link_type IN ('blocks', 'is_blocked_by', 'duplicates', 'relates_to', 'causes', 'is_caused_by'))
);

CREATE INDEX IF NOT EXISTS idx_links_source ON public.issue_links(source_issue_id);
CREATE INDEX IF NOT EXISTS idx_links_target ON public.issue_links(target_issue_id);

-- ============================================
-- CUSTOM_FIELDS (Optional - for extensibility)
-- ============================================
CREATE TABLE IF NOT EXISTS public.custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    field_type TEXT NOT NULL, -- 'text', 'number', 'select', 'date', 'user'
    options JSONB, -- For select fields
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(project_id, name),
    CHECK (field_type IN ('text', 'number', 'select', 'date', 'user'))
);

CREATE TABLE IF NOT EXISTS public.issue_custom_field_values (
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
    value TEXT,
    
    PRIMARY KEY (issue_id, field_id)
);

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_issues_updated_at
    BEFORE UPDATE ON public.issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.issue_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate issue key on insert
CREATE OR REPLACE FUNCTION generate_issue_key()
RETURNS TRIGGER AS $$
DECLARE
    project_key TEXT;
    next_number INTEGER;
BEGIN
    -- Get project key (first 4 chars of project title, uppercase)
    SELECT UPPER(SUBSTRING(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '', 'g'), 1, 4))
    INTO project_key
    FROM public.projects
    WHERE id = NEW.project_id;
    
    -- Get next issue number for this project
    SELECT COALESCE(MAX(CAST(SUBSTRING(key FROM LENGTH(project_key) + 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.issues
    WHERE project_id = NEW.project_id;
    
    -- Set the key
    NEW.key = project_key || '-' || next_number;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_issue_key_trigger
    BEFORE INSERT ON public.issues
    FOR EACH ROW
    WHEN (NEW.key IS NULL OR NEW.key = '')
    EXECUTE FUNCTION generate_issue_key();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worklogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_custom_field_values ENABLE ROW LEVEL SECURITY;

-- Issues: Users can view issues in projects they have access to
CREATE POLICY "Users can view issues in their projects"
    ON public.issues FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT project_id FROM public.project_collaborators
                WHERE user_id = auth.uid()
            )
        )
    );

-- Issues: Users can create issues in their projects
CREATE POLICY "Users can create issues in their projects"
    ON public.issues FOR INSERT
    WITH CHECK (
        project_id IN (
            SELECT id FROM public.projects
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT project_id FROM public.project_collaborators
                WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor')
            )
        )
    );

-- Issues: Users can update issues in their projects (if they have permission)
CREATE POLICY "Users can update issues in their projects"
    ON public.issues FOR UPDATE
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE user_id = auth.uid()
            OR id IN (
                SELECT project_id FROM public.project_collaborators
                WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor')
            )
        )
    );

-- Issues: Only project owners can delete issues
CREATE POLICY "Project owners can delete issues"
    ON public.issues FOR DELETE
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE user_id = auth.uid()
        )
    );

-- Comments: Users can view comments on issues they can see
CREATE POLICY "Users can view comments on accessible issues"
    ON public.issue_comments FOR SELECT
    USING (
        issue_id IN (
            SELECT id FROM public.issues
            WHERE project_id IN (
                SELECT id FROM public.projects
                WHERE user_id = auth.uid()
                OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
            )
        )
    );

-- Comments: Users can add comments to accessible issues
CREATE POLICY "Users can add comments to accessible issues"
    ON public.issue_comments FOR INSERT
    WITH CHECK (
        author_id = auth.uid()
        AND issue_id IN (
            SELECT id FROM public.issues
            WHERE project_id IN (
                SELECT id FROM public.projects
                WHERE user_id = auth.uid()
                OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
            )
        )
    );

-- Comments: Users can update their own comments
CREATE POLICY "Users can update their own comments"
    ON public.issue_comments FOR UPDATE
    USING (author_id = auth.uid());

-- Comments: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
    ON public.issue_comments FOR DELETE
    USING (author_id = auth.uid());

-- Similar RLS policies for other tables (simplified for brevity)
CREATE POLICY "Users can manage labels in their projects"
    ON public.labels FOR ALL
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE user_id = auth.uid()
            OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Users can manage sprints in their projects"
    ON public.sprints FOR ALL
    USING (
        project_id IN (
            SELECT id FROM public.projects
            WHERE user_id = auth.uid()
            OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
        )
    );

CREATE POLICY "Users can view attachments on accessible issues"
    ON public.issue_attachments FOR SELECT
    USING (
        issue_id IN (
            SELECT id FROM public.issues
            WHERE project_id IN (
                SELECT id FROM public.projects
                WHERE user_id = auth.uid()
                OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
            )
        )
    );

CREATE POLICY "Users can add attachments to accessible issues"
    ON public.issue_attachments FOR INSERT
    WITH CHECK (
        uploader_id = auth.uid()
        AND issue_id IN (
            SELECT id FROM public.issues
            WHERE project_id IN (
                SELECT id FROM public.projects
                WHERE user_id = auth.uid()
                OR id IN (SELECT project_id FROM public.project_collaborators WHERE user_id = auth.uid())
            )
        )
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get issue count for a project
CREATE OR REPLACE FUNCTION get_project_issue_count(p_project_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.issues WHERE project_id = p_project_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get sprint statistics
CREATE OR REPLACE FUNCTION get_sprint_stats(p_sprint_id UUID)
RETURNS TABLE(
    total_issues INTEGER,
    completed_issues INTEGER,
    in_progress_issues INTEGER,
    total_story_points INTEGER,
    completed_story_points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::INTEGER AS total_issues,
        COUNT(*) FILTER (WHERE status = 'done')::INTEGER AS completed_issues,
        COUNT(*) FILTER (WHERE status = 'in-progress')::INTEGER AS in_progress_issues,
        COALESCE(SUM(story_points), 0)::INTEGER AS total_story_points,
        COALESCE(SUM(story_points) FILTER (WHERE status = 'done'), 0)::INTEGER AS completed_story_points
    FROM public.issues
    WHERE sprint_id = p_sprint_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INITIAL DATA SETUP (Optional)
-- ============================================

-- Create default labels for new projects (could be triggered)
-- INSERT INTO public.labels (project_id, name, color) VALUES
-- (project_id, 'Bug', '#ef4444'),
-- (project_id, 'Feature', '#3b82f6'),
-- (project_id, 'Documentation', '#8b5cf6');

-- ============================================
-- MIGRATION NOTES
-- ============================================
-- 1. Run this script in your Supabase SQL editor
-- 2. Ensure the 'projects' table exists with proper structure
-- 3. Ensure the 'project_collaborators' table exists for RLS
-- 4. Update API routes to use these new tables
-- 5. Migrate existing localStorage data if needed
