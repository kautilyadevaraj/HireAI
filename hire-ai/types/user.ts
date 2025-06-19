export type UserRole = "recruiter" | "candidate";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    location?: string;
    title?: string;
    bio?: string;
    dateOfBirth?: string;
}

export interface CandidateProfile {
    userId: string;
    resume?: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string[];
    certifications: string[];
    portfolio?: string;
    socialLinks: SocialLinks;
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    location?: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    description?: string;
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
}
