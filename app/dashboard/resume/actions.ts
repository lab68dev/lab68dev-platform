"use server"

import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { revalidatePath } from "next/cache"

export async function saveResumeAction(data: any, resumeId?: string | null) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: "Unauthorized" }
    }

    const resumePayload = {
        user_id: user.id,
        title: data.title,
        template: data.template,
        personal_info: data.personalInfo,
        summary: data.summary,
        experience: data.experience,
        education: data.education,
        skills: data.skills,
        certifications: data.certifications,
        section_order: data.sectionOrder,
        style_settings: data.styleSettings,
        updated_at: new Date().toISOString()
    }

    if (resumeId) {
        // Update existing
        const { data: updatedResume, error } = await supabase
            .from("resumes")
            .update(resumePayload)
            .eq("id", resumeId)
            .eq("user_id", user.id)
            .select()
            .single()

        if (error) return { success: false, error: error.message }

        revalidatePath("/dashboard/resume")
        return { success: true, resume: updatedResume }
    } else {
        // Insert new
        const { data: newResume, error } = await supabase
            .from("resumes")
            .insert(resumePayload)
            .select()
            .single()

        if (error) return { success: false, error: error.message }

        revalidatePath("/dashboard/resume")
        return { success: true, resume: newResume }
    }
}

export async function deleteResumeAction(resumeId: string) {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: "Unauthorized" }
    }

    const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resumeId)
        .eq("user_id", user.id)

    if (error) return { success: false, error: error.message }

    revalidatePath("/dashboard/resume")
    return { success: true }
}
