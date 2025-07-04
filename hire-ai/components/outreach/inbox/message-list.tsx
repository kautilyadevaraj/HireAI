"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Mail, Reply, Clock, AlertCircle, CheckCircle2, Inbox } from "lucide-react";
import { useGmailInbox, type GmailMessage } from "@/hooks/use-gmail-inbox";
import type { Message } from "@/types/outreach";

interface MessageListProps {
    messages?: Message[];
    onMessageClick?: (message: Message) => void;
    useRealGmail?: boolean;
}

export function MessageList({ messages = [], onMessageClick, useRealGmail = true }: MessageListProps) {
    const [selectedTab, setSelectedTab] = useState<'all' | 'replies' | 'sent'>('all');
    const {
        messages: gmailMessages,
        loading,
        error,
        totalCount,
        lastRefresh,
        fetchMessages,
        fetchReplies,
        fetchSentMessages,
        markAsRead,
        refresh,
        isConnected,
    } = useGmailInbox();

    // Load initial data
    useEffect(() => {
        if (useRealGmail && isConnected) {
            fetchMessages();
        }
    }, [useRealGmail, isConnected, fetchMessages]);

    const extractSenderName = (fromHeader: string): string => {
        // Extract name from "John Doe <john@example.com>" or just return email
        const match = fromHeader.match(/^(.+?)\s*<(.+)>$/);
        if (match) {
            return match[1].replace(/"/g, '').trim();
        }
        return fromHeader.split('@')[0];
    };

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else if (days < 7) {
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    const getGmailStatusColor = (msg: GmailMessage) => {
        if (msg.isUnread) {
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
        } else if (msg.isReply) {
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
        } else {
            return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
        }
    };

    const getStatusColor = (status: Message["status"]) => {
        switch (status) {
            case "replied":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
            case "opened":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
            case "sent":
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
            case "bounced":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
        }
    };

    const handleTabChange = (tab: 'all' | 'replies' | 'sent') => {
        setSelectedTab(tab);
        if (!useRealGmail || !isConnected) return;

        switch (tab) {
            case 'replies':
                fetchReplies();
                break;
            case 'sent':
                fetchSentMessages();
                break;
            default:
                fetchMessages();
                break;
        }
    };

    const handleGmailMessageClick = (gmailMsg: GmailMessage) => {
        // Convert Gmail message to Message format for compatibility
        const message: Message = {
            id: parseInt(gmailMsg.id) || 0,
            candidate: extractSenderName(gmailMsg.from),
            candidateId: 0,
            subject: gmailMsg.subject,
            preview: gmailMsg.snippet || gmailMsg.textContent.slice(0, 100),
            time: formatDate(gmailMsg.date),
            status: gmailMsg.isUnread ? "replied" : gmailMsg.isReply ? "replied" : "sent",
            avatar: "/placeholder.svg",
            fullContent: gmailMsg.textContent,
            thread: [
                {
                    id: 1,
                    from: extractSenderName(gmailMsg.from),
                    content: gmailMsg.textContent,
                    timestamp: formatDate(gmailMsg.date),
                    type: gmailMsg.isReply ? "received" : "sent",
                    isRead: !gmailMsg.isUnread,
                }
            ]
        };

        if (gmailMsg.isUnread) {
            markAsRead(gmailMsg.id);
        }

        onMessageClick?.(message);
    };

    if (useRealGmail && !isConnected) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Inbox className="h-5 w-5" />
                        Gmail Inbox
                    </CardTitle>
                    <CardDescription>
                        Track email replies and outreach responses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <Mail className="h-4 w-4" />
                        <AlertDescription>
                            Connect your Gmail account to start tracking email replies and responses.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    const displayMessages = useRealGmail ? gmailMessages : messages;
    const unreadCount = gmailMessages.filter(msg => msg.isUnread).length;
    const replyCount = gmailMessages.filter(msg => msg.isReply).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Inbox className="h-5 w-5" />
                            {useRealGmail ? 'Gmail Inbox' : 'Recent Messages'}
                        </CardTitle>
                        <CardDescription>
                            {useRealGmail ? 'Real-time email tracking and responses' : 'Latest candidate responses and outreach activity'}
                        </CardDescription>
                    </div>
                    {useRealGmail && (
                        <div className="flex items-center gap-2">
                            {lastRefresh && (
                                <span className="text-xs text-muted-foreground">
                                    Updated {formatDate(lastRefresh.toISOString())}
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={refresh}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                    )}
                </div>
                
                {useRealGmail && (
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant={selectedTab === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTabChange('all')}
                            className="flex items-center gap-1"
                        >
                            <Mail className="h-3 w-3" />
                            All ({totalCount})
                        </Button>
                        <Button
                            variant={selectedTab === 'replies' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTabChange('replies')}
                            className="flex items-center gap-1"
                        >
                            <Reply className="h-3 w-3" />
                            Replies ({replyCount})
                        </Button>
                        <Button
                            variant={selectedTab === 'sent' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleTabChange('sent')}
                            className="flex items-center gap-1"
                        >
                            <CheckCircle2 className="h-3 w-3" />
                            Sent
                        </Button>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                                {unreadCount} unread
                            </Badge>
                        )}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start space-x-4 p-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayMessages.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No messages found</p>
                                {useRealGmail && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={refresh}
                                        className="mt-2"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                )}
                            </div>
                        ) : useRealGmail ? (
                            // Gmail messages
                            gmailMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
                                        message.isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
                                    }`}
                                    onClick={() => handleGmailMessageClick(message)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                            {getInitials(extractSenderName(message.from))}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={`font-medium ${message.isUnread ? 'font-semibold' : ''}`}>
                                                {extractSenderName(message.from)}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {message.isReply && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Reply className="h-3 w-3 mr-1" />
                                                        Reply
                                                    </Badge>
                                                )}
                                                <Badge className={getGmailStatusColor(message)}>
                                                    {message.isUnread ? 'Unread' : message.isReply ? 'Reply' : 'Read'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(message.date)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-medium text-muted-foreground ${message.isUnread ? 'font-semibold' : ''}`}>
                                            {message.subject || '(No subject)'}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {message.snippet || message.textContent.slice(0, 100)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Fallback to mock messages
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => onMessageClick?.(message)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={message.avatar || "/placeholder.svg"}
                                            alt={message.candidate}
                                        />
                                        <AvatarFallback>
                                            {message.candidate
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">
                                                {message.candidate}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={getStatusColor(
                                                        message.status,
                                                    )}
                                                >
                                                    {message.status}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {message.time}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {message.subject}
                                        </p>
                                        {message.preview && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {message.preview}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
