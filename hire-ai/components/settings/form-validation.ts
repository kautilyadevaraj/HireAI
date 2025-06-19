export interface ValidationError {
    field: string;
    message: string;
}

export function validateWorkExperience(experience: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!experience.company?.trim()) {
        errors.push({ field: "company", message: "Company name is required" });
    }

    if (!experience.position?.trim()) {
        errors.push({ field: "position", message: "Position is required" });
    }

    if (!experience.startDate) {
        errors.push({ field: "startDate", message: "Start date is required" });
    }

    if (!experience.current && !experience.endDate) {
        errors.push({
            field: "endDate",
            message: "End date is required for past positions",
        });
    }

    if (
        experience.startDate &&
        experience.endDate &&
        new Date(experience.startDate) > new Date(experience.endDate)
    ) {
        errors.push({
            field: "endDate",
            message: "End date must be after start date",
        });
    }

    return errors;
}

export function validateEducation(education: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!education.institution?.trim()) {
        errors.push({
            field: "institution",
            message: "Institution name is required",
        });
    }

    if (!education.degree?.trim()) {
        errors.push({ field: "degree", message: "Degree is required" });
    }

    if (!education.field?.trim()) {
        errors.push({ field: "field", message: "Field of study is required" });
    }

    if (!education.startDate) {
        errors.push({ field: "startDate", message: "Start date is required" });
    }

    if (!education.current && !education.endDate) {
        errors.push({
            field: "endDate",
            message: "End date is required for completed education",
        });
    }

    if (
        education.startDate &&
        education.endDate &&
        new Date(education.startDate) > new Date(education.endDate)
    ) {
        errors.push({
            field: "endDate",
            message: "End date must be after start date",
        });
    }

    return errors;
}

export function validateProfile(profile: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!profile.firstName?.trim()) {
        errors.push({ field: "firstName", message: "First name is required" });
    }

    if (!profile.lastName?.trim()) {
        errors.push({ field: "lastName", message: "Last name is required" });
    }

    if (!profile.email?.trim()) {
        errors.push({ field: "email", message: "Email is required" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        errors.push({
            field: "email",
            message: "Please enter a valid email address",
        });
    }

    if (profile.dateOfBirth && new Date(profile.dateOfBirth) > new Date()) {
        errors.push({
            field: "dateOfBirth",
            message: "Date of birth cannot be in the future",
        });
    }

    return errors;
}
