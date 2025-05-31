"use client"

import { Brain, Users, FileText, BarChart3, Mail, Database, Search, Settings, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Search Candidates",
    url: "/search",
    icon: Search,
  },
  {
    title: "Candidate Pool",
    url: "/candidates",
    icon: Users,
  },
  {
    title: "Resume Parser",
    url: "/resume-parser",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Outreach",
    url: "/outreach",
    icon: Mail,
  },
  {
    title: "Talent Pool",
    url: "/talent-pool",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">HireAI</span>
            <span className="text-xs text-muted-foreground">AI Hiring Platform</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">© 2024 HireAI Platform</div>
      </SidebarFooter>
    </Sidebar>
  )
}
