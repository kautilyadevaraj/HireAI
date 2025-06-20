"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
    Upload,
    FileText,
    Trophy,
    ThumbsUp,
    ThumbsDown,
    Star,
    AlertCircle,
    CheckCircle,
    Loader2,
    Target,
    Users,
    TrendingUp,
    ChevronDown,
    ChevronUp,
    Download,
    Trash2,
} from "lucide-react";

interface JDMatchResult {
    resumeId: string;
    resumeName: string;
    score: number;
    reasoning: {
        whyHire: string[];
        whyNotHire: string[];
        keyStrengths: string[];
        missingSkills: string[];
    };
    extractedText: string;
}

interface UploadedResume {
    id: string;
    file: File;
    name: string;
    size: number;
}

export default function JDMatcherPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<JDMatchResult[]>([]);
    const [averageScore, setAverageScore] = useState(0);
    const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
    const { toast } = useToast();

    const onDropResumes = useCallback((acceptedFiles: File[]) => {
        const newResumes = acceptedFiles.map((file) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
        }));
        setUploadedResumes((prev) => [...prev, ...newResumes]);
    }, []);

    const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
        onDrop: onDropResumes,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        multiple: true,
    });

    const removeResume = (id: string) => {
        setUploadedResumes((prev) => prev.filter((resume) => resume.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const analyzeMatches = async () => {
        if (!jobDescription.trim()) {
            toast({
                title: "Job Description Required",
                description: "Please enter a job description before analyzing.",
                variant: "destructive",
            });
            return;
        }

        if (uploadedResumes.length === 0) {
            toast({
                title: "Resumes Required",
                description: "Please upload at least one resume to analyze.",
                variant: "destructive",
            });
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("jobDescription", jobDescription);

            uploadedResumes.forEach((resume) => {
                formData.append(`resume_${resume.id}`, resume.file);
            });

            const response = await fetch("/api/jd-matcher", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.results);
                setAverageScore(data.averageScore);
                toast({
                    title: "Analysis Complete",
                    description: `Successfully analyzed ${data.totalResumes} resumes with an average score of ${data.averageScore}%.`,
                });
            } else {
                throw new Error(data.error || "Analysis failed");
            }
        } catch (error) {
            console.error("Analysis error:", error);
            toast({
                title: "Analysis Failed",
                description: error instanceof Error ? error.message : "An error occurred during analysis.",
                variant: "destructive",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleExpanded = (resultId: string) => {
        setExpandedResults((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(resultId)) {
                newSet.delete(resultId);
            } else {
                newSet.add(resultId);
            }
            return newSet;
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 80) return "default";
        if (score >= 60) return "secondary";
        return "destructive";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">
                        JD-Resume Matching
                    </h1>
                </div>
                <p className="text-muted-foreground">
                    Upload a job description and multiple resumes to get AI-powered matching scores and hiring recommendations.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Job Description Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Job Description
                        </CardTitle>
                        <CardDescription>
                            Paste or type the job description you want to match resumes against.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="job-description">Job Description</Label>
                            <Textarea
                                id="job-description"
                                placeholder="Paste your job description here. Include requirements, responsibilities, skills, experience level, etc."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                className="min-h-[300px] resize-none"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {jobDescription.length} characters
                        </div>
                    </CardContent>
                </Card>

                {/* Resume Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Resume Upload
                        </CardTitle>
                        <CardDescription>
                            Upload multiple resumes (PDF, DOC, DOCX) to compare against the job description.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Upload Area */}
                        <div
                            {...getResumeRootProps()}
                            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                        >
                            <input {...getResumeInputProps()} />
                            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-lg font-medium mb-2">
                                Drop resumes here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Support for PDF, DOC, and DOCX files up to 10MB each
                            </p>
                        </div>

                        {/* Uploaded Resumes List */}
                        {uploadedResumes.length > 0 && (
                            <div className="space-y-2">
                                <Label>Uploaded Resumes ({uploadedResumes.length})</Label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {uploadedResumes.map((resume) => (
                                        <div
                                            key={resume.id}
                                            className="flex items-center justify-between p-2 border rounded-md"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">{resume.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(resume.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeResume(resume.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
                <Button
                    onClick={analyzeMatches}
                    disabled={isAnalyzing || !jobDescription.trim() || uploadedResumes.length === 0}
                    size="lg"
                    className="px-8"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Analyzing Matches...
                        </>
                    ) : (
                        <>
                            <Target className="h-5 w-5 mr-2" />
                            Analyze Matches
                        </>
                    )}
                </Button>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-6">
                    <Separator />
                    
                    {/* Summary Stats */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">{results.length}</p>
                                        <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">{averageScore}%</p>
                                        <p className="text-sm text-muted-foreground">Average Score</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold">{Math.max(...results.map(r => r.score))}%</p>
                                        <p className="text-sm text-muted-foreground">Top Score</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Candidate Leaderboard
                            </CardTitle>
                            <CardDescription>
                                Ranked by matching score with detailed AI analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {results.map((result, index) => (
                                <Card key={result.resumeId} className="border-l-4" style={{
                                    borderLeftColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'transparent'
                                }}>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl font-bold text-muted-foreground">
                                                            #{index + 1}
                                                        </span>
                                                        {index < 3 && (
                                                            <Trophy className={`h-5 w-5 ${
                                                                index === 0 ? 'text-yellow-500' : 
                                                                index === 1 ? 'text-gray-400' : 'text-orange-600'
                                                            }`} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{result.resumeName}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant={getScoreBadgeVariant(result.score)}>
                                                                {result.score}% Match
                                                            </Badge>
                                                            <div className="flex items-center gap-1">
                                                                <Progress 
                                                                    value={result.score} 
                                                                    className="w-20 h-2"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleExpanded(result.resumeId)}
                                                >
                                                    {expandedResults.has(result.resumeId) ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>

                                            {/* Quick Summary */}
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <div className="flex items-start gap-2">
                                                    <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium">Top Strengths</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {result.reasoning.keyStrengths.slice(0, 2).join(", ")}
                                                            {result.reasoning.keyStrengths.length > 2 && "..."}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium">Missing Skills</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {result.reasoning.missingSkills.slice(0, 2).join(", ")}
                                                            {result.reasoning.missingSkills.length > 2 ? "..." : 
                                                             result.reasoning.missingSkills.length === 0 ? "None identified" : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Detailed Analysis (Collapsible) */}
                                            <Collapsible open={expandedResults.has(result.resumeId)}>
                                                <CollapsibleContent className="space-y-4">
                                                    <Separator />
                                                    <Tabs defaultValue="analysis" className="w-full">
                                                        <TabsList className="grid w-full grid-cols-2">
                                                            <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                                            <TabsTrigger value="extracted">Extracted Text</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="analysis" className="space-y-4">
                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                {/* Why Hire */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                                        <h5 className="font-medium">Why Hire</h5>
                                                                    </div>
                                                                    <ul className="space-y-1">
                                                                        {result.reasoning.whyHire.map((reason, i) => (
                                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                                <span className="inline-block w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                                {reason}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {/* Why Not Hire */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                                                        <h5 className="font-medium">Concerns</h5>
                                                                    </div>
                                                                    <ul className="space-y-1">
                                                                        {result.reasoning.whyNotHire.map((reason, i) => (
                                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                                {reason}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div className="grid gap-4 md:grid-cols-2">
                                                                {/* Key Strengths */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                                        <h5 className="font-medium">Key Strengths</h5>
                                                                    </div>
                                                                    <ul className="space-y-1">
                                                                        {result.reasoning.keyStrengths.map((strength, i) => (
                                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                                <span className="inline-block w-1 h-1 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                                {strength}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {/* Missing Skills */}
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <AlertCircle className="h-4 w-4 text-orange-500" />
                                                                        <h5 className="font-medium">Missing Skills</h5>
                                                                    </div>
                                                                    <ul className="space-y-1">
                                                                        {result.reasoning.missingSkills.map((skill, i) => (
                                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                                <span className="inline-block w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                                                                {skill}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                        <TabsContent value="extracted">
                                                            <div className="space-y-2">
                                                                <h5 className="font-medium">Extracted Resume Text</h5>
                                                                <div className="bg-muted p-4 rounded-md max-h-60 overflow-y-auto">
                                                                    <pre className="text-sm whitespace-pre-wrap font-mono">
                                                                        {result.extractedText}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
} 