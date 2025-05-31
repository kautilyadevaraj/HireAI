import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Mail, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

const stats = [
  {
    title: "Total Candidates",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Searches",
    value: "23",
    change: "+5%",
    icon: FileText,
    color: "text-green-600",
  },
  {
    title: "Outreach Sent",
    value: "156",
    change: "+8%",
    icon: Mail,
    color: "text-purple-600",
  },
  {
    title: "Response Rate",
    value: "34%",
    change: "+2%",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    action: "New candidate added",
    candidate: "Sarah Chen",
    time: "2 minutes ago",
    type: "success",
  },
  {
    action: "Resume parsed",
    candidate: "Michael Rodriguez",
    time: "15 minutes ago",
    type: "info",
  },
  {
    action: "Interview scheduled",
    candidate: "Emily Johnson",
    time: "1 hour ago",
    type: "warning",
  },
  {
    action: "Offer sent",
    candidate: "David Kim",
    time: "3 hours ago",
    type: "success",
  },
]

const topCandidates = [
  {
    name: "Alex Thompson",
    title: "Senior ML Engineer",
    match: 95,
    skills: ["PyTorch", "LangChain", "RAG"],
    location: "San Francisco, CA",
  },
  {
    name: "Maria Garcia",
    title: "AI Research Scientist",
    match: 92,
    skills: ["TensorFlow", "NLP", "Computer Vision"],
    location: "New York, NY",
  },
  {
    name: "James Wilson",
    title: "GenAI Engineer",
    match: 89,
    skills: ["OpenAI API", "Vector DBs", "LLMs"],
    location: "Austin, TX",
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your hiring pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your hiring pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {activity.type === "info" && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === "warning" && <Clock className="h-4 w-4 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.candidate}</p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Top Matches</CardTitle>
            <CardDescription>Highest scoring candidates this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCandidates.map((candidate, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.title}</p>
                    </div>
                    <Badge variant="secondary">{candidate.match}%</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{candidate.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/search">
                <Users className="h-6 w-6 mb-2" />
                Search Candidates
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/resume-parser">
                <FileText className="h-6 w-6 mb-2" />
                Parse Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/outreach">
                <Mail className="h-6 w-6 mb-2" />
                Send Outreach
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
