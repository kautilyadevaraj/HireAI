"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfileSection } from "@/components/settings/profile-section";
import { CandidateProfileSection } from "@/components/settings/candidate-profile-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { PrivacySection } from "@/components/settings/privacy-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import type { User, CandidateProfile } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { getUserRole } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/use-user";

const mockCandidateProfile: CandidateProfile = {
    userId: "1",
    workExperience: [],
    education: [],
    skills: ["Python", "PyTorch", "LangChain", "RAG", "AWS"],
    certifications: ["AWS Certified ML Specialist"],
    socialLinks: {
        linkedin: "https://linkedin.com/in/sarahchen",
        github: "https://github.com/sarahchen",
    },
};

export default function CandidateSettingsPage() {
    const { user: fetchedUser, loading: userLoading } = useUser();
    const [user, setUser] = useState<User | null>(null);
    const [candidateProfile, setCandidateProfile] =
        useState<CandidateProfile>(mockCandidateProfile);
    const router = useRouter();
    const { toast } = useToast();
    const [role, setRole] = useState<string | null>(null);

    // Update local user state when fetched user changes
    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
        }
    }, [fetchedUser]);

    const handleUserSave = async (userData: Partial<User>) => {
        if (!user) return;

        try {
            const supabase = createClient();
            
            // Update display name in Supabase auth metadata
            const fullName = `${userData.firstName || user.firstName} ${userData.lastName || user.lastName}`.trim();
            
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    display_name: fullName,
                }
            });

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setUser({ ...user, ...userData });

            toast({
                title: "Profile Updated",
                description: "Your profile has been saved successfully.",
            });
        } catch (error) {
            console.error("Error saving user data:", error);
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleProfileSave = (profileData: Partial<CandidateProfile>) => {
        try {
            setCandidateProfile({ ...candidateProfile, ...profileData });

            // In real app, make API call
            console.log("Saving profile data:", profileData);

            // Show success toast
            toast({
                title: "Profile Updated",
                description: "Your profile has been saved successfully.",
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        // In real app, implement logout logic
        console.log("Logging out...");
        router.push("/login");
    };

    useEffect(() => {
        const checkRole = async () => {
            const supabase = createClient(); // no need for await here
            const userRole = await getUserRole(supabase);
            if (userRole === "candidate") {
                setRole("candidate");
            } else {
                setRole(userRole); // fallback in case it's recruiter or other
            }
        };

        checkRole();
    }, []);

    if (userLoading || !user) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="button-elegant focus-elegant"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList
                    className={`grid w-full ${
                        role === "candidate" ? "grid-cols-5" : "grid-cols-4"
                    }`}
                >
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    {role === "candidate" ? (
                        <TabsTrigger value="candidate-profile">
                            Career Profile
                        </TabsTrigger>
                    ) : (
                        <></>
                    )}
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <ProfileSection user={user} onSave={handleUserSave} />
                </TabsContent>

                {role === "candidate" && (
                    <TabsContent
                        value="candidate-profile"
                        className="space-y-6"
                    >
                        <CandidateProfileSection
                            profile={candidateProfile}
                            onSave={handleProfileSave}
                        />
                    </TabsContent>
                )}

                <TabsContent value="notifications" className="space-y-6">
                    <NotificationsSection />
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                    <PrivacySection />
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                    <PreferencesSection />
                </TabsContent>
            </Tabs>
        </div>
    );
}
