"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Star,
    ExternalLink,
    Bookmark,
    Heart,
} from "lucide-react";

const mockJobs = [
    {
        id: 1,
        title: "Senior ML Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$180k - $220k",
        type: "Full-time",
        remote: true,
        match: 95,
        skills: ["PyTorch", "LangChain", "RAG", "Python", "AWS"],
        description:
            "Join our AI team to build next-generation machine learning systems...",
        posted: "2 days ago",
        applicants: 23,
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        title: "AI Research Scientist",
        company: "AI Innovations",
        location: "New York, NY",
        salary: "$200k - $250k",
        type: "Full-time",
        remote: false,
        match: 92,
        skills: ["TensorFlow", "NLP", "Computer Vision", "Research", "PhD"],
        description:
            "Lead cutting-edge research in artificial intelligence and machine learning...",
        posted: "1 week ago",
        applicants: 45,
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        title: "GenAI Engineer",
        company: "Future Labs",
        location: "Austin, TX",
        salary: "$160k - $190k",
        type: "Full-time",
        remote: true,
        match: 89,
        skills: ["OpenAI API", "Vector DBs", "LLMs", "React", "Node.js"],
        description: "Build innovative generative AI applications and tools...",
        posted: "3 days ago",
        applicants: 18,
        logo: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 4,
        title: "Machine Learning Engineer",
        company: "DataTech Solutions",
        location: "Seattle, WA",
        salary: "$170k - $200k",
        type: "Full-time",
        remote: true,
        match: 87,
        skills: ["Scikit-learn", "MLOps", "Docker", "Kubernetes", "GCP"],
        description:
            "Design and implement ML pipelines for production systems...",
        posted: "5 days ago",
        applicants: 31,
        logo: "/placeholder.svg?height=40&width=40",
    },
];

export default function JobSearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [salaryRange, setSalaryRange] = useState([100, 300]);
    const [savedJobs, setSavedJobs] = useState<number[]>([]);

    const toggleSaveJob = (jobId: number) => {
        setSavedJobs((prev) =>
            prev.includes(jobId)
                ? prev.filter((id) => id !== jobId)
                : [...prev, jobId],
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Job Search
                </h1>
                <p className="text-muted-foreground">
                    Discover AI and ML opportunities that match your skills and
                    interests.
                </p>
            </div>

            {/* Search Interface */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search for jobs, companies, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-20 h-12 text-lg"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Filters Sidebar */}
                {showFilters && (
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label>Job Type</Label>
                                <div className="space-y-2">
                                    {[
                                        "Full-time",
                                        "Part-time",
                                        "Contract",
                                        "Internship",
                                    ].map((type) => (
                                        <div
                                            key={type}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox id={type} />
                                            <Label
                                                htmlFor={type}
                                                className="text-sm"
                                            >
                                                {type}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Location</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="remote">
                                            Remote
                                        </SelectItem>
                                        <SelectItem value="sf">
                                            San Francisco
                                        </SelectItem>
                                        <SelectItem value="ny">
                                            New York
                                        </SelectItem>
                                        <SelectItem value="austin">
                                            Austin
                                        </SelectItem>
                                        <SelectItem value="seattle">
                                            Seattle
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label>Salary Range (k$)</Label>
                                <Slider
                                    value={salaryRange}
                                    onValueChange={setSalaryRange}
                                    max={300}
                                    min={50}
                                    step={10}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>${salaryRange[0]}k</span>
                                    <span>${salaryRange[1]}k</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Experience Level</Label>
                                <div className="space-y-2">
                                    {[
                                        "Entry Level",
                                        "Mid Level",
                                        "Senior Level",
                                        "Lead/Principal",
                                    ].map((level) => (
                                        <div
                                            key={level}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox id={level} />
                                            <Label
                                                htmlFor={level}
                                                className="text-sm"
                                            >
                                                {level}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Skills</Label>
                                <div className="space-y-2">
                                    {[
                                        "Python",
                                        "PyTorch",
                                        "TensorFlow",
                                        "LangChain",
                                        "RAG",
                                        "NLP",
                                        "Computer Vision",
                                        "MLOps",
                                    ].map((skill) => (
                                        <div
                                            key={skill}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox id={skill} />
                                            <Label
                                                htmlFor={skill}
                                                className="text-sm"
                                            >
                                                {skill}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                <div
                    className={`space-y-4 ${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Found {mockJobs.length} jobs
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-sm">Sort by:</Label>
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">
                                        Relevance
                                    </SelectItem>
                                    <SelectItem value="date">
                                        Date Posted
                                    </SelectItem>
                                    <SelectItem value="salary">
                                        Salary
                                    </SelectItem>
                                    <SelectItem value="company">
                                        Company
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {mockJobs.map((job) => (
                        <Card
                            key={job.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                            <img
                                                src={
                                                    job.logo ||
                                                    "/placeholder.svg"
                                                }
                                                alt={job.company}
                                                className="w-8 h-8"
                                            />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {job.title}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {job.company}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {job.location}
                                                    {job.remote && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-1"
                                                        >
                                                            Remote
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {job.posted}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4" />
                                                    {job.applicants} applicants
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {job.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {job.skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2 ml-4">
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                            {job.match}% match
                                        </Badge>
                                        <p className="text-sm font-medium">
                                            {job.salary}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {job.type}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    toggleSaveJob(job.id)
                                                }
                                            >
                                                {savedJobs.includes(job.id) ? (
                                                    <Heart className="h-3 w-3 fill-current text-red-500" />
                                                ) : (
                                                    <Bookmark className="h-3 w-3" />
                                                )}
                                            </Button>
                                            <Button size="sm">
                                                Apply Now
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center justify-center space-x-2 pt-4">
                        <Button variant="outline" size="sm">
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            1
                        </Button>
                        <Button size="sm">2</Button>
                        <Button variant="outline" size="sm">
                            3
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
