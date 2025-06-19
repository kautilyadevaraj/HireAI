"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Upload,
    Save,
    Plus,
    Trash2,
    Briefcase,
    GraduationCap,
    Award,
    LinkIcon,
    FileText,
} from "lucide-react";
import type { CandidateProfile, WorkExperience, Education } from "@/types/user";
import { DatePicker } from "@/components/date-picker";
import {
    validateWorkExperience,
    validateEducation,
    type ValidationError,
} from "./form-validation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CandidateProfileSectionProps {
    profile: CandidateProfile;
    onSave: (profileData: Partial<CandidateProfile>) => void;
}

export function CandidateProfileSection({
    profile,
    onSave,
}: CandidateProfileSectionProps) {
    const [workExperience, setWorkExperience] = useState<WorkExperience[]>(
        profile.workExperience || [],
    );
    const [education, setEducation] = useState<Education[]>(
        profile.education || [],
    );
    const [skills, setSkills] = useState<string[]>(profile.skills || []);
    const [certifications, setCertifications] = useState<string[]>(
        profile.certifications || [],
    );
    const [socialLinks, setSocialLinks] = useState(profile.socialLinks || {});
    const [newSkill, setNewSkill] = useState("");
    const [newCertification, setNewCertification] = useState("");
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
        [],
    );

    const addWorkExperience = () => {
        const newExp: WorkExperience = {
            id: Date.now().toString(),
            company: "",
            position: "",
            startDate: "",
            current: false,
            description: "",
        };
        setWorkExperience([...workExperience, newExp]);
    };

    const updateWorkExperience = (
        id: string,
        updates: Partial<WorkExperience>,
    ) => {
        setWorkExperience(
            workExperience.map((exp) =>
                exp.id === id ? { ...exp, ...updates } : exp,
            ),
        );
    };

    const removeWorkExperience = (id: string) => {
        setWorkExperience(workExperience.filter((exp) => exp.id !== id));
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: Date.now().toString(),
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            current: false,
        };
        setEducation([...education, newEdu]);
    };

    const updateEducation = (id: string, updates: Partial<Education>) => {
        setEducation(
            education.map((edu) =>
                edu.id === id ? { ...edu, ...updates } : edu,
            ),
        );
    };

    const removeEducation = (id: string) => {
        setEducation(education.filter((edu) => edu.id !== id));
    };

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const addCertification = () => {
        if (
            newCertification.trim() &&
            !certifications.includes(newCertification.trim())
        ) {
            setCertifications([...certifications, newCertification.trim()]);
            setNewCertification("");
        }
    };

    const removeCertification = (cert: string) => {
        setCertifications(certifications.filter((c) => c !== cert));
    };

    const handleSave = () => {
        const errors: ValidationError[] = [];

        // Validate work experience
        workExperience.forEach((exp, index) => {
            const expErrors = validateWorkExperience(exp);
            errors.push(
                ...expErrors.map((err) => ({
                    ...err,
                    field: `workExp_${index}_${err.field}`,
                })),
            );
        });

        // Validate education
        education.forEach((edu, index) => {
            const eduErrors = validateEducation(edu);
            errors.push(
                ...eduErrors.map((err) => ({
                    ...err,
                    field: `edu_${index}_${err.field}`,
                })),
            );
        });

        setValidationErrors(errors);

        if (errors.length === 0) {
            onSave({
                workExperience,
                education,
                skills,
                certifications,
                socialLinks,
            });

            // Show success message or toast
            console.log("Profile saved successfully!");
        }
    };

    return (
        <div className="space-y-6">
            {validationErrors.length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please fix the following errors:
                        <ul className="mt-2 list-disc list-inside">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error.message}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
            {/* Resume Upload */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Resume
                    </CardTitle>
                    <CardDescription>
                        Upload your latest resume for better job matching
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                            Drop your resume here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX up to 5MB
                        </p>
                        <Button variant="outline" className="mt-4">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Work Experience
                    </CardTitle>
                    <CardDescription>
                        Add your professional work experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {workExperience.map((exp, index) => (
                        <div
                            key={exp.id}
                            className="space-y-4 p-4 border rounded-lg"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                    Experience {index + 1}
                                </h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeWorkExperience(exp.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input
                                        value={exp.company}
                                        onChange={(e) =>
                                            updateWorkExperience(exp.id, {
                                                company: e.target.value,
                                            })
                                        }
                                        placeholder="Company name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input
                                        value={exp.position}
                                        onChange={(e) =>
                                            updateWorkExperience(exp.id, {
                                                position: e.target.value,
                                            })
                                        }
                                        placeholder="Job title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <DatePicker
                                        label="Start Date"
                                        value={
                                            exp.startDate
                                                ? new Date(exp.startDate)
                                                : undefined
                                        }
                                        onChange={(date) =>
                                            updateWorkExperience(exp.id, {
                                                startDate:
                                                    date
                                                        ?.toISOString()
                                                        .split("T")[0] || "",
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <DatePicker
                                        label="End Date"
                                        value={
                                            exp.endDate
                                                ? new Date(exp.endDate)
                                                : undefined
                                        }
                                        onChange={(date) =>
                                            updateWorkExperience(exp.id, {
                                                endDate:
                                                    date
                                                        ?.toISOString()
                                                        .split("T")[0] || "",
                                            })
                                        }
                                        className="w-full"
                                        placeholder={
                                            exp.current
                                                ? "Current position"
                                                : "Select end date"
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={exp.current}
                                    onCheckedChange={(checked) =>
                                        updateWorkExperience(exp.id, {
                                            current: checked,
                                        })
                                    }
                                />
                                <Label>I currently work here</Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={exp.description}
                                    onChange={(e) =>
                                        updateWorkExperience(exp.id, {
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Describe your role and achievements..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={addWorkExperience}
                        variant="outline"
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Work Experience
                    </Button>
                </CardContent>
            </Card>

            {/* Education */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Education
                    </CardTitle>
                    <CardDescription>
                        Add your educational background
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {education.map((edu, index) => (
                        <div
                            key={edu.id}
                            className="space-y-4 p-4 border rounded-lg"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium">
                                    Education {index + 1}
                                </h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEducation(edu.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Institution</Label>
                                    <Input
                                        value={edu.institution}
                                        onChange={(e) =>
                                            updateEducation(edu.id, {
                                                institution: e.target.value,
                                            })
                                        }
                                        placeholder="University/School name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input
                                        value={edu.degree}
                                        onChange={(e) =>
                                            updateEducation(edu.id, {
                                                degree: e.target.value,
                                            })
                                        }
                                        placeholder="Bachelor's, Master's, PhD, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Field of Study</Label>
                                    <Input
                                        value={edu.field}
                                        onChange={(e) =>
                                            updateEducation(edu.id, {
                                                field: e.target.value,
                                            })
                                        }
                                        placeholder="Computer Science, Engineering, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>GPA (Optional)</Label>
                                    <Input
                                        value={edu.gpa || ""}
                                        onChange={(e) =>
                                            updateEducation(edu.id, {
                                                gpa: e.target.value,
                                            })
                                        }
                                        placeholder="3.8/4.0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <DatePicker
                                        label="Start Date"
                                        value={
                                            edu.startDate
                                                ? new Date(edu.startDate)
                                                : undefined
                                        }
                                        onChange={(date) =>
                                            updateEducation(edu.id, {
                                                startDate:
                                                    date
                                                        ?.toISOString()
                                                        .split("T")[0] || "",
                                            })
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <DatePicker
                                        label="End Date"
                                        value={
                                            edu.endDate
                                                ? new Date(edu.endDate)
                                                : undefined
                                        }
                                        onChange={(date) =>
                                            updateEducation(edu.id, {
                                                endDate:
                                                    date
                                                        ?.toISOString()
                                                        .split("T")[0] || "",
                                            })
                                        }
                                        className="w-full"
                                        placeholder={
                                            edu.current
                                                ? "Currently studying"
                                                : "Select end date"
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={edu.current}
                                    onCheckedChange={(checked) =>
                                        updateEducation(edu.id, {
                                            current: checked,
                                        })
                                    }
                                />
                                <Label>I currently study here</Label>
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={addEducation}
                        variant="outline"
                        className="w-full"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                    </Button>
                </CardContent>
            </Card>

            {/* Skills */}
            <Card>
                <CardHeader>
                    <CardTitle>Skills & Technologies</CardTitle>
                    <CardDescription>
                        Add your technical and professional skills
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill..."
                            onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button onClick={addSkill}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {skill}
                                <button onClick={() => removeSkill(skill)}>
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certifications
                    </CardTitle>
                    <CardDescription>
                        Add your professional certifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={newCertification}
                            onChange={(e) =>
                                setNewCertification(e.target.value)
                            }
                            placeholder="Add a certification..."
                            onKeyPress={(e) =>
                                e.key === "Enter" && addCertification()
                            }
                        />
                        <Button onClick={addCertification}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => (
                            <Badge
                                key={cert}
                                variant="outline"
                                className="flex items-center gap-1"
                            >
                                {cert}
                                <button
                                    onClick={() => removeCertification(cert)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Social Links & Portfolio
                    </CardTitle>
                    <CardDescription>
                        Add links to your professional profiles and portfolio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <Input
                                value={socialLinks.linkedin || ""}
                                onChange={(e) =>
                                    setSocialLinks({
                                        ...socialLinks,
                                        linkedin: e.target.value,
                                    })
                                }
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>GitHub</Label>
                            <Input
                                value={socialLinks.github || ""}
                                onChange={(e) =>
                                    setSocialLinks({
                                        ...socialLinks,
                                        github: e.target.value,
                                    })
                                }
                                placeholder="https://github.com/yourusername"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Portfolio Website</Label>
                            <Input
                                value={socialLinks.portfolio || ""}
                                onChange={(e) =>
                                    setSocialLinks({
                                        ...socialLinks,
                                        portfolio: e.target.value,
                                    })
                                }
                                placeholder="https://yourportfolio.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Personal Website</Label>
                            <Input
                                value={socialLinks.website || ""}
                                onChange={(e) =>
                                    setSocialLinks({
                                        ...socialLinks,
                                        website: e.target.value,
                                    })
                                }
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Profile
            </Button>
        </div>
    );
}
