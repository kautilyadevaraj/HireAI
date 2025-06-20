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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Save } from "lucide-react";
import type { User as UserType } from "@/types/user";
import { DatePicker } from "@/components/date-picker";

interface ProfileSectionProps {
    user: UserType;
    onSave: (userData: Partial<UserType>) => void;
}

export function ProfileSection({ user, onSave }: ProfileSectionProps) {
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
        title: user.title || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth || "",
    });

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                </CardTitle>
                <CardDescription>
                    Update your personal information and profile details
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage
                            src={
                                user.avatar ||
                                "/placeholder.svg?height=96&width=96"
                            }
                            alt="Profile"
                        />
                        <AvatarFallback className="text-lg">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Change Photo
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            JPG, PNG or GIF. Max size 2MB.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    firstName: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    lastName: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <DatePicker
                            label="Date of Birth"
                            value={
                                formData.dateOfBirth
                                    ? new Date(formData.dateOfBirth)
                                    : undefined
                            }
                            onChange={(date) =>
                                setFormData({
                                    ...formData,
                                    dateOfBirth:
                                        date?.toISOString().split("T")[0] || "",
                                })
                            }
                            className="w-full"
                            placeholder="Select date of birth"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                        }
                        className="min-h-[100px]"
                    />
                </div>

                <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </CardContent>
        </Card>
    );
}
