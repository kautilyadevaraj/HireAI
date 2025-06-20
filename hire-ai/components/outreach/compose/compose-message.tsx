"use client";

import { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Clock, Save, Users, Mail, Eye, AlertCircle, CheckCircle2, CircleCheck, CircleX, Loader2 } from "lucide-react";
import type { EmailTemplate } from "@/types/outreach";
import { htmlTemplates } from "@/app/(recruiter)/outreach/_templates";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ComposeMessageProps {
    templates?: EmailTemplate[];
}

// Local state management for Gmail auth
let gmailTokens: {
    access_token: string;
    refresh_token: string;
    expiry_date?: number;
} | null = null;

export function ComposeMessage({
    templates = htmlTemplates,
}: ComposeMessageProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>("no-template");
    const [emailData, setEmailData] = useState({
        to: [] as string[],
        subject: "",
        text: "",
        html: "",
    });
    const [selectedRecipientGroup, setSelectedRecipientGroup] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState<"text" | "html">("text");
    const [isSending, setIsSending] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [customEmails, setCustomEmails] = useState<string[]>([]);
    const [customEmailInput, setCustomEmailInput] = useState("");
    
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for URL parameters and sessionStorage on component mount
    useEffect(() => {
        const checkGmailAuth = async () => {
            // First check for existing tokens in localStorage
            const storedTokens = localStorage.getItem('gmail_tokens');
            if (storedTokens) {
                try {
                    const tokens = JSON.parse(storedTokens);
                    // Check if tokens are still valid (not expired)
                    if (tokens.expiry_date && Date.now() < tokens.expiry_date) {
                        gmailTokens = tokens;
                        setIsConnected(true);
                        console.log('Gmail tokens loaded from localStorage');
                        return; // Don't check URL params if we already have valid tokens
                    } else {
                        // Tokens expired, clear them
                        localStorage.removeItem('gmail_tokens');
                        console.log('Gmail tokens expired, cleared from localStorage');
                    }
                } catch (error) {
                    console.error('Error parsing stored Gmail tokens:', error);
                    localStorage.removeItem('gmail_tokens');
                }
            }

            // Then check for new OAuth callback
            const gmailAuth = searchParams.get('gmail_auth');
            const gmailError = searchParams.get('gmail_error');

            console.log('ComposeMessage URL params:', {
                gmailAuth,
                gmailError
            });

            if (gmailAuth === 'success') {
                // Check sessionStorage for new tokens from OAuth callback
                const newTokens = sessionStorage.getItem('gmail_tokens');
                if (newTokens) {
                    try {
                        const tokens = JSON.parse(newTokens);
                        gmailTokens = tokens;
                        setIsConnected(true);
                        
                        // Store in localStorage for persistence
                        localStorage.setItem('gmail_tokens', JSON.stringify(tokens));
                        toast.success('Gmail connected successfully!');
                        
                        // Clean up sessionStorage and URL
                        sessionStorage.removeItem('gmail_tokens');
                        const url = new URL(window.location.href);
                        url.searchParams.delete('gmail_auth');
                        router.replace(url.pathname + url.search);
                    } catch (error) {
                        console.error('Error parsing stored tokens:', error);
                        toast.error('Failed to connect Gmail');
                    }
                } else {
                    toast.error('No Gmail tokens found');
                }
            } else if (gmailError) {
                const errorMessages: { [key: string]: string } = {
                    'access_denied': 'Gmail access was denied. Please try again.',
                    'no_code': 'No authorization code received from Gmail.',
                    'token_exchange_failed': 'Failed to exchange code for tokens.',
                    'unknown': 'An unknown error occurred during Gmail authentication.'
                };
                
                const message = errorMessages[gmailError] || 'Gmail connection failed';
                toast.error(message);
                setIsConnected(false);
                
                // Clean up URL
                const url = new URL(window.location.href);
                url.searchParams.delete('gmail_error');
                router.replace(url.pathname + url.search);
            }
        };

        checkGmailAuth();
    }, [searchParams, router]);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find((t) => t.id.toString() === templateId);
        if (template) {
            setEmailData((prev) => ({
                ...prev,
                subject: template.subject,
                text: template.content,
                html: template.content.includes('<') ? template.content : `<p>${template.content.replace(/\n/g, '</p><p>')}</p>`,
            }));
        }
    };

    const getRecipientEmails = (recipients: string): string[] => {
        // put supabase DB query here later
        const recipientMap: Record<string, string[]> = {
            "saved-search": ["contact.taufeeq@gmail.com", "kautilyadk@gmail.com"],
            "shortlist": ["contact.taufeeq@gmail.com", "kautilyadk@gmail.com"],
            "talent-pool": ["contact.taufeeq@gmail.com", "kautilyadk@gmail.com"],
            "custom": ["contact.taufeeq@gmail.com", "kautilyadk@gmail.com"],
        };
        return recipientMap[recipients] || [];
    };

    const handleRecipientChange = (value: string) => {
        setSelectedRecipientGroup(value);
        if (value === "custom") {
            // For custom, use the customEmails array
            setEmailData((prev) => ({
                ...prev,
                to: customEmails,
            }));
        } else {
            // For predefined groups, use the mapped emails
            const recipientEmails = getRecipientEmails(value);
            setEmailData((prev) => ({
                ...prev,
                to: recipientEmails,
            }));
        }
    };

    const addCustomEmail = (email: string) => {
        const trimmedEmail = email.trim();
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (trimmedEmail && emailRegex.test(trimmedEmail) && !customEmails.includes(trimmedEmail)) {
            const newEmails = [...customEmails, trimmedEmail];
            setCustomEmails(newEmails);
            setEmailData((prev) => ({
                ...prev,
                to: newEmails,
            }));
        } else if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
            toast.error(`Invalid email format: ${trimmedEmail}`);
        } else if (customEmails.includes(trimmedEmail)) {
            toast.error(`Email already added: ${trimmedEmail}`);
        }
    };

    const removeCustomEmail = (emailToRemove: string) => {
        const newEmails = customEmails.filter(email => email !== emailToRemove);
        setCustomEmails(newEmails);
        setEmailData((prev) => ({
            ...prev,
            to: newEmails,
        }));
    };

    const handleCustomEmailInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = (e.target as HTMLInputElement).value;
        
        if (e.key === ',') {
            e.preventDefault();
            addCustomEmail(value);
            setCustomEmailInput("");
        } else if (e.key === 'Enter') {
            e.preventDefault();
            addCustomEmail(value);
            setCustomEmailInput("");
        } else if (e.key === 'Backspace' && value === '' && customEmails.length > 0) {
            // Remove last email if backspace on empty input
            const newEmails = customEmails.slice(0, -1);
            setCustomEmails(newEmails);
            setEmailData((prev) => ({
                ...prev,
                to: newEmails,
            }));
        }
    };

    const handleCustomEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        // Check if comma was typed
        if (value.includes(',')) {
            const emails = value.split(',');
            const emailsToAdd = emails.slice(0, -1); // All but the last part
            const remaining = emails[emails.length - 1]; // What's after the last comma
            
            emailsToAdd.forEach(email => addCustomEmail(email));
            setCustomEmailInput(remaining);
        } else {
            setCustomEmailInput(value);
        }
    };

    const processTemplateVariables = (content: string): string => {
        // Mock data for template variables - replace with actual candidate data
        const mockData = {
            firstName: "John",
            lastName: "Doe",
            company: "TechCorp Inc.",
            position: "Senior AI Engineer",
            skills: "Machine Learning, Python, TensorFlow",
            salaryRange: "$120k - $160k",
            recruiterName: "Sarah Johnson",
            location: "San Francisco, CA",
            industry: "Technology",
            currentCompany: "Current Tech Co",
            teamSize: "15",
            recruiterTitle: "Senior Technical Recruiter",
            recruiterEmail: "sarah@company.com",
            interviewDate: "March 15th, 2024",
            interviewTime: "2:00 PM PST",
            duration: "60",
            interviewFormat: "Video call (Google Meet)",
            interviewers: "John Smith (CTO), Jane Doe (Lead Engineer)",
            meetingLink: "https://meet.google.com/abc-defg-hij",
            techTopics: "System Design, Machine Learning",
            relevantTech: "Python, TensorFlow, AWS",
            strongPoints: "system architecture and ML implementation",
            specificFeedback:
                "Your approach to scalable ML systems was particularly impressive",
            futureRole1: "Staff Engineer positions",
            futureRole2: "ML Engineering Lead roles",
            futureRole3: "AI Research positions",
            linkedinProfile: "https://linkedin.com/in/recruiter",
            keyBenefit1: "Equity in a fast-growing startup",
            keyBenefit2: "Flexible remote work policy",
            keyBenefit3: "Professional development budget of $5k/year",
        };

        let processedContent = content;
        Object.entries(mockData).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}}`, "g");
            processedContent = processedContent.replace(regex, value);
        });

        return processedContent;
    };

    const connectGmail = async () => {
        try {
            setIsConnecting(true);
            console.log('Connecting to Gmail...');
            
            const response = await fetch('/api/gmail/auth-url');
            const data = await response.json();
            
            console.log('Auth URL response:', data);
            
            if (data.success && data.authUrl) {
                console.log('Redirecting to:', data.authUrl);
                // Redirect to Google OAuth
                window.location.href = data.authUrl;
            } else {
                console.error('Failed to get auth URL:', data.error);
                toast.error(data.error || 'Failed to initiate Gmail connection');
                setIsConnecting(false);
            }
        } catch (error) {
            console.error('Error connecting to Gmail:', error);
            toast.error('Failed to connect to Gmail');
            setIsConnecting(false);
        }
    };

    const disconnectGmail = () => {
        // Clear tokens from memory and localStorage
        gmailTokens = null;
        localStorage.removeItem('gmail_tokens');
        setIsConnected(false);
        toast.success('Gmail disconnected successfully');
        console.log('Gmail disconnected');
    };

    const handleSendNow = async () => {
        if (!emailData.to.length || !emailData.subject || !emailData.text) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!isConnected || !gmailTokens) {
            toast.error('Please connect your Gmail account first');
            return;
        }

        setIsSending(true);
        try {
            // Check if access token needs refresh
            let currentTokens = gmailTokens;
            if (currentTokens.expiry_date && Date.now() >= (currentTokens.expiry_date - 5 * 60 * 1000)) {
                console.log('Access token expiring soon, refreshing...');
                try {
                    const refreshResponse = await fetch('/api/gmail/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refreshToken: currentTokens.refresh_token,
                        }),
                    });

                    const refreshResult = await refreshResponse.json();
                    if (refreshResult.success) {
                        currentTokens = {
                            access_token: refreshResult.accessToken,
                            refresh_token: currentTokens.refresh_token,
                            expiry_date: refreshResult.expiryDate
                        };
                        gmailTokens = currentTokens;
                        localStorage.setItem('gmail_tokens', JSON.stringify(currentTokens));
                        console.log('Access token refreshed successfully');
                    } else {
                        throw new Error(refreshResult.error);
                    }
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                    toast.error('Gmail session expired. Please reconnect.');
                    disconnectGmail();
                    return;
                }
            }

            // Process template variables before sending
            const processedSubject = processTemplateVariables(emailData.subject);
            const processedContent = processTemplateVariables(emailData.text);

            const response = await fetch('/api/gmail/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: emailData.to,
                    subject: processedSubject,
                    text: processedContent,
                    html: emailData.html || `<p>${processedContent.replace(/\n/g, '</p><p>')}</p>`,
                    accessToken: currentTokens.access_token,
                }),
            });

            const result = await response.json();
            console.log('Send email response:', result);

            if (result.success) {
                toast.success('Email sent successfully!');
                // Reset form after successful send
                setEmailData({
                    to: [],
                    subject: "",
                    text: "",
                    html: "",
                });
                setSelectedRecipientGroup("");
                setSelectedTemplate("no-template");
                setCustomEmails([]);
                setCustomEmailInput("");
            } else {
                console.error('Failed to send email:', result.error);
                toast.error(result.error || 'Failed to send email');
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error('Failed to send email');
        } finally {
            setIsSending(false);
        }
    };

    const handleScheduleSend = () => {
        // Implementation for scheduling message
        console.log("Scheduling message:", emailData);
    };

    const handleSaveDraft = () => {
        // Implementation for saving draft
        console.log("Saving draft:", emailData);
    };

    const isFormValid = emailData.to.length > 0 && emailData.subject && emailData.text;

    // Check if current content is HTML
    const isHtmlContent = emailData.text.includes("<html>") || emailData.text.includes("<!DOCTYPE");

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Gmail Connection Status */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5" />
                                <div>
                                    <p className="font-medium">Gmail Connection</p>
                                    <p className="text-sm text-muted-foreground">
                                        {isConnected ? 'Connected to Gmail' : 'Connect your Gmail account to send emails'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {isConnected ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        <CircleCheck className="h-3 w-3 mr-1" />
                                        Connected
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                                        <CircleX className="h-3 w-3 mr-1" />
                                        Not Connected
                                    </Badge>
                                )}
                                {isConnected ? (
                                    <Button 
                                        onClick={disconnectGmail} 
                                        variant="outline"
                                        size="sm"
                                    >
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={connectGmail} 
                                        disabled={isConnecting}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {isConnecting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            'Connect Gmail'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Compose Message
                    </CardTitle>
                    <CardDescription>
                        Send personalized outreach to candidates using HTML
                        templates
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="template">Template</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Select
                                        value={selectedTemplate}
                                        onValueChange={handleTemplateChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no-template">
                                                No template
                                            </SelectItem>
                                            {templates.map((template) => (
                                                <SelectItem
                                                    key={template.id}
                                                    value={template.id.toString()}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {template.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                template.responseRate
                                                            }
                                                            % response rate
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Choose a pre-built HTML template to
                                        start with
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="candidates">Recipients</Label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Select
                                        value={selectedRecipientGroup}
                                        onValueChange={handleRecipientChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select candidates" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="saved-search">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Saved Search Results (2 recipients)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="shortlist">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Shortlisted Candidates (2 recipients)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="talent-pool">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Talent Pool (2 recipients)
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="custom">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    Custom Email List ({customEmails.length} recipients)
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Select which candidates will receive
                                        this message
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Custom Email Input */}
                    {selectedRecipientGroup === "custom" && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="custom-emails" className="text-sm font-medium">
                                    Custom Email Recipients
                                </Label>
                                {customEmails.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        {customEmails.length} recipient{customEmails.length !== 1 ? 's' : ''}
                                    </Badge>
                                )}
                            </div>
                            <div className="border border-input rounded-lg p-3 min-h-[120px] bg-background focus-within:border-ring transition-colors">
                                {/* Email Tags */}
                                {customEmails.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-border/50">
                                        {customEmails.map((email, index) => (
                                            <div
                                                key={index}
                                                className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-blue-100 dark:hover:bg-blue-900"
                                            >
                                                <Mail className="h-3 w-3 mr-1.5" />
                                                <span>{email}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomEmail(email)}
                                                    className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                                    aria-label={`Remove ${email}`}
                                                >
                                                    <CircleX className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Email Input */}
                                <div className="relative">
                                    <Input
                                        id="custom-emails"
                                        placeholder={customEmails.length === 0 ? "Enter email addresses (e.g., user@example.com)" : "Add more email addresses..."}
                                        value={customEmailInput}
                                        onChange={handleCustomEmailChange}
                                        onKeyDown={handleCustomEmailInput}
                                        className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm placeholder:text-muted-foreground/70"
                                    />
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                <div className="bg-muted/50 rounded-md p-2 flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <span className="font-medium">How to add emails:</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div>• Type an email and press <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-background border rounded text-xs">Comma</kbd></div>
                                        <div>• Click <CircleX className="h-3 w-3 inline mx-0.5" /> to remove emails</div>
                                        <div>• Paste multiple emails separated by commas</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show selected recipients count */}
                    {emailData.to.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Will send to {emailData.to.length} recipient{emailData.to.length !== 1 ? "s" : ""}: {emailData.to.join(", ")}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            placeholder="Email subject line"
                            value={emailData.subject}
                            onChange={(e) =>
                                setEmailData((prev) => ({
                                    ...prev,
                                    subject: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="message">Message</Label>
                            {isHtmlContent && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setPreviewMode(
                                                previewMode === "text"
                                                    ? "html"
                                                    : "text",
                                            )
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        {previewMode === "text"
                                            ? "Preview HTML"
                                            : "Edit Source"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {previewMode === "html" && isHtmlContent ? (
                            <div className="border rounded-lg min-h-[400px] p-4 bg-white">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: processTemplateVariables(
                                            emailData.text,
                                        ),
                                    }}
                                    className="prose max-w-none"
                                />
                            </div>
                        ) : (
                            <Textarea
                                id="message"
                                placeholder="Compose your message..."
                                className="min-h-[400px] font-mono text-sm"
                                value={emailData.text}
                                onChange={(e) =>
                                    setEmailData((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                    }))
                                }
                            />
                        )}
                    </div>

                    {isHtmlContent && (
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                            <strong>Template Variables Available:</strong>{" "}
                            {"{firstName}"}, {"{lastName}"}, {"{company}"},{" "}
                            {"{position}"}, {"{skills}"}, {"{salaryRange}"},{" "}
                            {"{recruiterName}"}, and more. Variables will be
                            automatically replaced when sending.
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSendNow}
                                    disabled={!isFormValid || isSending || !isConnected}
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Now
                                        </>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Send email immediately via Gmail</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={handleScheduleSend}
                                    disabled={!isFormValid || isSending}
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Schedule Send
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Schedule the message to be sent at a specific time</p>
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={isSending}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                        </Button>
                    </div>

                    {/* Status Messages */}
                    {!isConnected && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Connect your Gmail account to start sending emails.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    </TooltipProvider>
);
}
