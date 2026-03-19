import { ResumeData } from "@/lib/types/resume";

export const DEFAULT_RESUME_DATA: ResumeData = {
    personalInfo: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "johndoe.com",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        photoUrl: "",
    },
    summary: "Experienced professional with a proven track record in software development and project management. Passionate about creating innovative solutions and leading high-performing teams to deliver exceptional results.",
    experience: [
        {
            id: '1',
            company: 'Tech Company Inc.',
            position: 'Senior Software Engineer',
            startDate: '2020-01',
            endDate: '2024-12',
            description: 'Led development of scalable web applications, mentored junior developers, and implemented best practices for code quality and testing.',
            current: true,
        },
        {
            id: '2',
            company: 'StartUp Solutions',
            position: 'Full Stack Developer',
            startDate: '2018-06',
            endDate: '2019-12',
            description: 'Built and maintained full-stack applications using React, Node.js, and PostgreSQL. Collaborated with cross-functional teams to deliver features on time.',
            current: false,
        },
    ],
    education: [
        {
            id: '1',
            school: 'University of Technology',
            degree: "Bachelor's Degree",
            field: 'Computer Science',
            startDate: '2014-09',
            endDate: '2018-05',
            current: false,
        },
    ],
    skills: [
        { id: '1', category: 'Languages', items: 'JavaScript, TypeScript, Python, SQL' },
        { id: '2', category: 'Frameworks', items: 'React, Next.js, Node.js' },
        { id: '3', category: 'Tools', items: 'Git, Docker, AWS, Google Cloud' },
    ],
    certifications: [
        'AWS Certified Solutions Architect',
        'Professional Scrum Master (PSM I)',
        'Google Cloud Professional Developer',
    ],
    projects: [
        {
            id: '1',
            name: 'Portfolio Builder Platform',
            description: 'A comprehensive platform for developers to build and manage their portfolios with integrated AI assistance.',
            url: 'https://github.com/lab68dev/platform',
            codeSnippet: 'function executeTask() {\n  return "Done!";\n}',
            language: 'typescript'
        }
    ],
    sectionOrder: [
        { id: 'summary', visible: true },
        { id: 'experience', visible: true },
        { id: 'education', visible: true },
        { id: 'skills', visible: true },
        { id: 'certifications', visible: true },
        { id: 'projects', visible: true },
    ],
    styleSettings: {
        primaryColor: '#000000',
        secondaryColor: '#4b5563',
        fontFamily: 'serif',
        fontSize: 'medium',
    },
}
