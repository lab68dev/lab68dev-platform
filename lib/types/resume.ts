export type Template = 'modern' | 'classic' | 'minimal' | 'creative' | 'professional' | 'harvard'
export type SectionType = 'summary' | 'experience' | 'education' | 'skills' | 'certifications'

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
    name: string
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface SectionOrder {
    id: SectionType
    visible: boolean
}

export interface StyleSettings {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    fontSize: 'small' | 'medium' | 'large'
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
    sectionOrder: SectionOrder[]
    styleSettings: StyleSettings
}
