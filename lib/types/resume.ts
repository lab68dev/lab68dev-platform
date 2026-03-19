export type Template = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'harvard'
export type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects'

export interface Project {
    id: string
    name: string
    description: string
    url: string
    codeSnippet: string
    language: string
}

export interface Experience {
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
    current: boolean
}

export interface Education {
    id: string
    school: string
    degree: string
    field: string
    startDate: string
    endDate: string
    current: boolean
}

export interface Skill {
    id: string
    category: string
    items: string
}

export interface SectionOrder {
    id: SectionType
    visible: boolean
}

export interface StyleSettings {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    fontSize: string
}

export interface ResumeData {
    personalInfo: {
        fullName: string
        email: string
        phone: string
        location: string
        website: string
        linkedin: string
        github: string
        photoUrl: string
    }
    summary: string
    experience: Experience[]
    education: Education[]
    skills: Skill[]
    certifications: string[]
    projects: Project[]
    sectionOrder: SectionOrder[]
    styleSettings: StyleSettings
}
