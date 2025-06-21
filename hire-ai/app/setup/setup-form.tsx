"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, GraduationCap, Check, Sparkles, Users, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SetupForm() {
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !role) {
            setError("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setError("");

        const supabase = createClient();

        try {
            // setting display name
            const data = {
                display_name: fullName,
            };
            const { error: nameError } = await supabase.auth.updateUser({
                data,
            });
            if (nameError) {
                setError("Failed to update profile. Please try again.");
                return;
            }

            // setting user role
            const { data: userData, error: userError } =
                await supabase.auth.getUser();
            const userId = userData.user?.id;
            const { error: roleError } = await supabase
                .from("user_roles")
                .update({ role: role })
                .eq("user_id", userId);

            if (roleError) {
                setError("Failed to set role. Please try again.");
                console.error(roleError);
                return;
            }

            await supabase.auth.refreshSession();
            router.push("/");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        {
            value: "recruiter",
            title: "Recruiter",
            description: "Find and recruit top talent with advanced tools",
            features: ["Smart candidate search", "Resume parsing & matching", "Automated outreach campaigns"],
            icon: Briefcase,
            gradient: "from-blue-500 via-blue-600 to-purple-600",
            accent: "border-blue-500/20 hover:border-blue-500/40",
        },
        {
            value: "candidate",
            title: "Candidate",
            description: "Discover your next career opportunity",
            features: ["Personalized job recommendations", "Skills assessment tools", "Direct recruiter connections"],
            icon: GraduationCap,
            gradient: "from-emerald-500 via-teal-600 to-cyan-600",
            accent: "border-emerald-500/20 hover:border-emerald-500/40",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div 
                className="text-center space-y-4"
                style={{
                    animation: "elegant-fade-in 600ms var(--ease-out-cubic)",
                }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
                    <Sparkles className="h-4 w-4" />
                    Welcome to HeadRoom
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Let's personalize your experience
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Tell us about yourself so we can tailor HeadRoom to your needs and help you achieve your goals
                </p>
            </div>

            {/* Main Form Card */}
            <Card 
                className="card-elegant border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl"
                style={{
                    animationDelay: "200ms",
                    animation: "elegant-slide-in 700ms var(--ease-out-cubic) forwards",
                    opacity: 0,
                }}
            >
                <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">Setup Your Profile</CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80">
                        This will only take a moment
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8 px-8 pb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Full Name Input */}
                        <div 
                            className="space-y-3"
                            style={{
                                animationDelay: "400ms",
                                animation: "elegant-fade-in 500ms var(--ease-out-cubic) forwards",
                                opacity: 0,
                            }}
                        >
                            <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="input-elegant h-12 text-base border-2 bg-background/50"
                            />
                        </div>

                        {/* Role Selection */}
                        <div 
                            className="space-y-6"
                            style={{
                                animationDelay: "500ms",
                                animation: "elegant-fade-in 500ms var(--ease-out-cubic) forwards",
                                opacity: 0,
                            }}
                        >
                            <Label className="text-base font-medium flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                What best describes you?
                            </Label>
                            
                            <div className="grid gap-6 md:grid-cols-2">
                                {roleOptions.map((option, index) => {
                                    const IconComponent = option.icon;
                                    const isSelected = role === option.value;

                                    return (
                                        <Card
                                            key={option.value}
                                            className={`card-elegant relative cursor-pointer transition-all duration-400 group ${
                                                isSelected
                                                    ? `border-primary/40 shadow-lg shadow-primary/10 ${option.accent.split(' ')[0]}`
                                                    : `border-border/50 hover:border-border ${option.accent}`
                                            }`}
                                            onClick={() => setRole(option.value)}
                                            style={{
                                                animationDelay: `${600 + index * 100}ms`,
                                                animation: "elegant-scale-in 500ms var(--ease-out-cubic) forwards",
                                                opacity: 0,
                                            }}
                                        >
                                            <CardContent className="p-6 space-y-6">
                                                {/* Selected Indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                        <Check className="w-4 h-4 text-primary-foreground" />
                                                    </div>
                                                )}

                                                {/* Icon with Gradient Background */}
                                                <div className="text-center space-y-4">
                                                    <div
                                                        className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                                                    >
                                                        <IconComponent className="w-8 h-8 text-white" />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold">{option.title}</h3>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Features List */}
                                                <div className="space-y-2 pt-2 border-t border-border/30">
                                                    {option.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <div className="w-1 h-1 bg-primary/60 rounded-full" />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div 
                                className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                                style={{
                                    animation: "elegant-fade-in 300ms var(--ease-out-cubic)",
                                }}
                            >
                                <p className="text-destructive text-sm font-medium flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-destructive" />
                                    </div>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="button-elegant w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isLoading || !fullName || !role}
                            style={{
                                animationDelay: "800ms",
                                animation: "elegant-fade-in 500ms var(--ease-out-cubic) forwards",
                                opacity: 0,
                            }}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Setting up your account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Complete Setup
                                </div>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Footer */}
            <div 
                className="text-center text-sm text-muted-foreground/60"
                style={{
                    animationDelay: "900ms",
                    animation: "elegant-fade-in 500ms var(--ease-out-cubic) forwards",
                    opacity: 0,
                }}
            >
                <p>
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
}
