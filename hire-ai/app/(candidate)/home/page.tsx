import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Search,
    Briefcase,
    MessageSquare,
    TrendingUp,
    Clock,
    CheckCircle,
    Eye,
    Star,
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        title: "Profile Views",
        value: "127",
        change: "+23%",
        icon: Eye,
        color: "text-blue-600",
    },
    {
        title: "Applications",
        value: "8",
        change: "+2",
        icon: Briefcase,
        color: "text-green-600",
    },
    {
        title: "Messages",
        value: "5",
        change: "+3",
        icon: MessageSquare,
        color: "text-purple-600",
    },
    {
        title: "Profile Score",
        value: "85%",
        change: "+5%",
        icon: Star,
        color: "text-orange-600",
    },
];

const recentActivity = [
    {
        action: "Profile viewed by TechCorp",
        time: "2 hours ago",
        type: "info",
    },
    {
        action: "Application submitted to AI Innovations",
        time: "1 day ago",
        type: "success",
    },
    {
        action: "New message from recruiter",
        time: "2 days ago",
        type: "warning",
    },
    {
        action: "Interview scheduled with DataTech",
        time: "3 days ago",
        type: "success",
    },
];

const recommendedJobs = [
    {
        title: "Senior ML Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$180k - $220k",
        match: 95,
        skills: ["PyTorch", "LangChain", "RAG"],
        posted: "2 days ago",
    },
    {
        title: "AI Research Scientist",
        company: "AI Innovations",
        location: "New York, NY",
        salary: "$200k - $250k",
        match: 92,
        skills: ["TensorFlow", "NLP", "Research"],
        posted: "1 week ago",
    },
    {
        title: "GenAI Engineer",
        company: "Future Labs",
        location: "Austin, TX",
        salary: "$160k - $190k",
        match: 89,
        skills: ["OpenAI API", "Vector DBs", "LLMs"],
        posted: "3 days ago",
    },
];

export default function CandidateDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, Sarah!
                </h1>
                <p className="text-muted-foreground">
                    Here's your career progress and new opportunities.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">
                                    {stat.change}
                                </span>{" "}
                                from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Profile Completion */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                        <CardDescription>
                            Complete your profile to get better matches
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Overall Progress</span>
                                <span>85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Basic Info</span>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Work Experience</span>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Skills & Certifications</span>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Portfolio</span>
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                        </div>
                        <Button asChild size="sm" className="w-full">
                            <Link href="/candidate/profile">
                                Complete Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest career activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        {activity.type === "success" && (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        )}
                                        {activity.type === "info" && (
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        )}
                                        {activity.type === "warning" && (
                                            <MessageSquare className="h-4 w-4 text-orange-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommended Jobs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Jobs</CardTitle>
                        <CardDescription>
                            Jobs matching your profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recommendedJobs.slice(0, 2).map((job, index) => (
                                <div
                                    key={index}
                                    className="space-y-2 p-3 border rounded-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {job.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {job.company}
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {job.match}%
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {job.location} • {job.salary}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {job.skills.slice(0, 2).map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="w-full mt-4"
                        >
                            <Link href="/candidate/jobs">View All Jobs</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common tasks to advance your career
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button asChild className="h-20 flex-col">
                            <Link href="/candidate/jobs">
                                <Search className="h-6 w-6 mb-2" />
                                Search Jobs
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex-col"
                        >
                            <Link href="/candidate/applications">
                                <Briefcase className="h-6 w-6 mb-2" />
                                My Applications
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex-col"
                        >
                            <Link href="/candidate/messages">
                                <MessageSquare className="h-6 w-6 mb-2" />
                                Messages
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex-col"
                        >
                            <Link href="/candidate/profile">
                                <TrendingUp className="h-6 w-6 mb-2" />
                                Update Profile
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
