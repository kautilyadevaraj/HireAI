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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Save } from "lucide-react";

export function PrivacySection() {
    const [profileVisibility, setProfileVisibility] = useState(true);

    const handleSave = () => {
        // In real app, save to API
        console.log("Saving privacy settings");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy & Security
                </CardTitle>
                <CardDescription>
                    Manage your privacy settings and account security
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Profile Visibility</Label>
                            <p className="text-sm text-muted-foreground">
                                Make your profile visible to recruiters and
                                employers
                            </p>
                        </div>
                        <Switch
                            checked={profileVisibility}
                            onCheckedChange={setProfileVisibility}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label>Who can contact you</Label>
                        <Select defaultValue="verified">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="everyone">
                                    Everyone
                                </SelectItem>
                                <SelectItem value="verified">
                                    Verified recruiters only
                                </SelectItem>
                                <SelectItem value="connections">
                                    Connections only
                                </SelectItem>
                                <SelectItem value="nobody">Nobody</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label>Data & Privacy</Label>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Share analytics data
                                </Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Allow activity tracking
                                </Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Show online status
                                </Label>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label>Security Actions</Label>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                Change Password
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                Two-Factor Authentication
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                Download My Data
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Settings
                </Button>
            </CardContent>
        </Card>
    );
}
