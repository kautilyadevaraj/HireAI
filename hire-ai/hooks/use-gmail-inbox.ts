import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface GmailMessage {
    id: string;
    threadId: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    messageId: string;
    inReplyTo?: string;
    references?: string;
    textContent: string;
    htmlContent: string;
    isReply: boolean;
    isUnread: boolean;
    labelIds: string[];
    snippet: string;
}

export interface GmailInboxData {
    messages: GmailMessage[];
    totalCount: number;
}

export function useGmailInbox() {
    const [messages, setMessages] = useState<GmailMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const getStoredTokens = useCallback(() => {
        const storedTokens = localStorage.getItem('gmail_tokens');
        if (storedTokens) {
            try {
                const tokens = JSON.parse(storedTokens);
                if (tokens.expiry_date && Date.now() < tokens.expiry_date) {
                    return tokens;
                }
                localStorage.removeItem('gmail_tokens');
            } catch (error) {
                console.error('Error parsing stored Gmail tokens:', error);
                localStorage.removeItem('gmail_tokens');
            }
        }
        return null;
    }, []);

    const refreshTokenIfNeeded = useCallback(async (tokens: any) => {
        if (!tokens.refresh_token) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch('/api/gmail/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: tokens.refresh_token,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const newTokens = await response.json();
            localStorage.setItem('gmail_tokens', JSON.stringify(newTokens));
            return newTokens;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }, []);

    const fetchMessages = useCallback(async (options: {
        query?: string;
        maxResults?: number;
        forceRefresh?: boolean;
    } = {}) => {
        const { query = 'in:inbox', maxResults = 20, forceRefresh = false } = options;

        setLoading(true);
        setError(null);

        try {
            let tokens = getStoredTokens();
            if (!tokens) {
                throw new Error('No Gmail authentication found. Please connect your Gmail account.');
            }

            // Check if token is close to expiry (within 5 minutes)
            const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
            if (tokens.expiry_date && tokens.expiry_date < fiveMinutesFromNow) {
                tokens = await refreshTokenIfNeeded(tokens);
            }

            const searchParams = new URLSearchParams({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || '',
                query,
                maxResults: maxResults.toString(),
            });

            const response = await fetch(`/api/gmail/messages?${searchParams}`);
            
            if (response.status === 401) {
                // Try to refresh token and retry
                tokens = await refreshTokenIfNeeded(tokens);
                const retrySearchParams = new URLSearchParams({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token || '',
                    query,
                    maxResults: maxResults.toString(),
                });
                
                const retryResponse = await fetch(`/api/gmail/messages?${retrySearchParams}`);
                if (!retryResponse.ok) {
                    throw new Error('Failed to fetch messages after token refresh');
                }
                
                const data: GmailInboxData = await retryResponse.json();
                setMessages(data.messages);
                setTotalCount(data.totalCount);
                setLastRefresh(new Date());
                return data;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch messages');
            }

            const data: GmailInboxData = await response.json();
            setMessages(data.messages);
            setTotalCount(data.totalCount);
            setLastRefresh(new Date());
            return data;

        } catch (error: any) {
            console.error('Error fetching Gmail messages:', error);
            setError(error.message);
            toast.error(`Failed to fetch inbox: ${error.message}`);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [getStoredTokens, refreshTokenIfNeeded]);

    const fetchReplies = useCallback(async () => {
        return fetchMessages({
            query: 'in:inbox is:unread',
            maxResults: 50,
        });
    }, [fetchMessages]);

    const fetchSentMessages = useCallback(async () => {
        return fetchMessages({
            query: 'in:sent',
            maxResults: 50,
        });
    }, [fetchMessages]);

    const markAsRead = useCallback(async (messageId: string) => {
        try {
            const tokens = getStoredTokens();
            if (!tokens) {
                throw new Error('No Gmail authentication found');
            }

            // Update local state optimistically
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === messageId 
                        ? { ...msg, isUnread: false, labelIds: msg.labelIds.filter(id => id !== 'UNREAD') }
                        : msg
                )
            );

            // Make API call to mark as read in Gmail
            const response = await fetch('/api/gmail/mark-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                }),
            });

            if (!response.ok) {
                // If API call fails, revert the optimistic update
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === messageId 
                            ? { ...msg, isUnread: true, labelIds: [...msg.labelIds, 'UNREAD'] }
                            : msg
                    )
                );
                throw new Error('Failed to mark message as read');
            }
        } catch (error: any) {
            console.error('Error marking message as read:', error);
            toast.error('Failed to mark message as read');
        }
    }, [getStoredTokens]);

    const refresh = useCallback(() => {
        return fetchMessages({ forceRefresh: true });
    }, [fetchMessages]);

    // Auto-refresh every 30 seconds if we have messages
    useEffect(() => {
        if (messages.length > 0) {
            const interval = setInterval(() => {
                fetchMessages({ forceRefresh: true });
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [messages.length, fetchMessages]);

    return {
        messages,
        loading,
        error,
        totalCount,
        lastRefresh,
        fetchMessages,
        fetchReplies,
        fetchSentMessages,
        markAsRead,
        refresh,
        isConnected: !!getStoredTokens(),
    };
} 