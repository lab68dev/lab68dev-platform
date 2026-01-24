import { createServerSupabaseClient } from "./supabase-server"

export async function getDashboardData() {
    const supabase = await createServerSupabaseClient()

    // Get current user session
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) return null

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

    const user = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        avatar: profile?.avatar,
        language: profile?.language || 'en'
    }

    // Fetch counts in parallel
    const [projectsRes, todosRes, milestonesRes, meetingsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user.id),
        supabase.from('todos').select('*').eq('user_id', user.id),
        supabase.from('milestones').select('*').eq('user_id', user.id),
        supabase.from('meetings').select('*').eq('user_id', user.id).order('date', { ascending: true })
    ])

    const counts = {
        projects: projectsRes.data?.length || 0,
        todos: todosRes.data?.filter((t: any) => !t.completed).length || 0,
        milestones: milestonesRes.data?.filter((m: any) => m.status !== 'completed').length || 0,
        meetings: meetingsRes.data?.length || 0
    }

    const upcomingMeetings = meetingsRes.data?.map((m: any) => ({
        id: m.id,
        title: m.title,
        date: new Date(m.date),
        time: new Date(m.date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        status: 'scheduled'
    })) || []

    return {
        user,
        counts,
        upcomingMeetings
    }
}

export async function getResumeById(id: string) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return null

    const { data: resume, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !resume) return null

    return {
        id: resume.id,
        title: resume.title,
        data: {
            personalInfo: resume.personal_info,
            summary: resume.summary,
            experience: resume.experience,
            education: resume.education,
            skills: resume.skills,
            certifications: resume.certifications,
            sectionOrder: resume.section_order,
            styleSettings: resume.style_settings
        }
    }
}
