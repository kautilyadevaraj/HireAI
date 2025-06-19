"use client";

import {
    Search,
    User,
    Briefcase,
    Settings,
    Home,
    BookOpen,
    Award,
    MessageSquare,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Job Search",
        url: "/jobs",
        icon: Search,
    },
    {
        title: "Applications",
        url: "/applications",
        icon: Briefcase,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function CandidateSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">HireAI</span>
                        <span className="text-xs text-muted-foreground">
                            Candidate Portal
                        </span>
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
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
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
                <div className="text-xs text-muted-foreground">
                    © 2024 HireAI Platform
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
