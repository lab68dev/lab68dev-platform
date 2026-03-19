import { createServerSupabaseClient } from '@/lib/database/supabase-server'
import { notFound } from 'next/navigation'
import { AnalyticsTracker } from '@/components/resume/AnalyticsTracker'
import { ResumeData } from '@/lib/types/resume'
import { Metadata } from 'next'
import { ResumeA4 } from '@/components/resume/ResumeA4'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: resume } = await supabase
    .from('resumes')
    .select('title, personal_info')
    .filter('id', 'eq', id)
    .single()

  if (!resume) return { title: 'Not Found' }

  return {
    title: `${resume.personal_info?.fullName || 'Portfolio'} | ${resume.title}`,
    description: 'A professional portfolio created with Lab68Dev Platform',
  }
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .filter('id', 'eq', id)
    .single()

  if (!resume || error) {
    return notFound()
  }

  const resumeData: ResumeData = resume.data

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center py-12 print:py-0 print:bg-white">
      <AnalyticsTracker resumeId={id} />
      
      {/* We reuse ResumeA4 but give it dummy handlers to make it read-only.
          The print CSS handles hiding non-public things if needed.
          We also wrap it in a pointer-events-none layer for areas we don't want edited. 
          For a true read-only, we should ideally disable inline editing. 
          But pointer-events-none works for a quick static preview renderer!
      */}
      <div className="pointer-events-none shadow-2xl print:shadow-none bg-white">
        <ResumeA4
          editorRef={{ current: null } as any}
          resumeData={resumeData}
          setResumeData={() => {}}
          selectedTemplate={resume.template || 'modern'}
          zoomLevel={1}
          showPhotoUpload={false}
          handlePhotoUpload={() => {}}
          toggleSectionVisibility={() => {}}
          handleDragStart={() => {}}
          handleDragOver={() => {}}
          handleDragEnd={() => {}}
          updateExperience={() => {}}
          removeExperience={() => {}}
          addExperience={() => {}}
          updateEducation={() => {}}
          removeEducation={() => {}}
          addEducation={() => {}}
          updateSkill={() => {}}
          removeSkill={() => {}}
          addSkill={() => {}}
          updateCertification={() => {}}
          removeCertification={() => {}}
          addCertification={() => {}}
          updateProject={() => {}}
          removeProject={() => {}}
          addProject={() => {}}
          getFontSizeClass={() => resumeData.styleSettings.fontSize === 'small' ? 'text-xs' : resumeData.styleSettings.fontSize === 'large' ? 'text-base' : 'text-sm'}
        />
      </div>
    </div>
  )
}
