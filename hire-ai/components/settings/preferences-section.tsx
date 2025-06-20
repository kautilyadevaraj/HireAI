"use client";
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
import { Palette, Save } from "lucide-react";

export function PreferencesSection() {
    const handleSave = () => {
        // In real app, save to API
        console.log("Saving preferences");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Display & Preferences
                </CardTitle>
                <CardDescription>
                    Customize your experience and interface preferences
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select defaultValue="system">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select defaultValue="pst">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pst">
                                    Pacific Time (PST)
                                </SelectItem>
                                <SelectItem value="mst">
                                    Mountain Time (MST)
                                </SelectItem>
                                <SelectItem value="cst">
                                    Central Time (CST)
                                </SelectItem>
                                <SelectItem value="est">
                                    Eastern Time (EST)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label>Interface Preferences</Label>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Compact mode
                                </Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Show keyboard shortcuts
                                </Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Auto-save drafts
                                </Label>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Default Dashboard View</Label>
                        <Select defaultValue="overview">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overview">
                                    Overview
                                </SelectItem>
                                <SelectItem value="recent">
                                    Recent Activity
                                </SelectItem>
                                <SelectItem value="analytics">
                                    Analytics
                                </SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Preferences
                </Button>
            </CardContent>
        </Card>
    );
}
