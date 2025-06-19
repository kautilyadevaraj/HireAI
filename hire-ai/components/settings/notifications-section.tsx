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
import { Bell, Save } from "lucide-react";

export function NotificationsSection() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const handleSave = () => {
        // In real app, save to API
        console.log("Saving notification preferences");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                </CardTitle>
                <CardDescription>
                    Choose how you want to be notified about important updates
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive push notifications in your browser
                            </p>
                        </div>
                        <Switch
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label>Email Frequency</Label>
                        <Select defaultValue="daily">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="immediate">
                                    Immediate
                                </SelectItem>
                                <SelectItem value="daily">
                                    Daily digest
                                </SelectItem>
                                <SelectItem value="weekly">
                                    Weekly digest
                                </SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label>Notification Types</Label>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    New messages
                                </Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Job recommendations
                                </Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    Profile views
                                </Label>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label className="font-normal">
                                    System updates
                                </Label>
                                <Switch defaultChecked />
                            </div>
                        </div>
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
