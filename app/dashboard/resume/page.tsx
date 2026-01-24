import { DEFAULT_RESUME_DATA } from "@/lib/constants/resume"
import { getResumeById } from "@/lib/database/dashboard-server"
import { ResumeClient } from "@/components/resume/ResumeClient"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resume Editor | Lab68Dev",
  description: "Create and edit professional resumes with real-time preview.",
}

export default async function ResumeEditorPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const resumeId = searchParams.id || null
  let initialData = DEFAULT_RESUME_DATA
  let initialTitle = "My Resume"

  if (resumeId) {
    const resume = await getResumeById(resumeId)
    if (resume) {
      initialData = resume.data
      initialTitle = resume.title
    }
  }

  return (
    <ResumeClient 
      initialData={initialData} 
      initialTitle={initialTitle} 
      initialId={resumeId}
    />
  )
}
