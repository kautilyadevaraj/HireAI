import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const query = searchParams.get('query') || 'in:inbox';
        const maxResults = parseInt(searchParams.get('maxResults') || '10');
        
        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 });
        }

        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        auth.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        const gmail = google.gmail({ version: 'v1', auth });

        // Get list of messages
        const messagesResponse = await gmail.users.messages.list({
            userId: 'me',
            q: query,
            maxResults: maxResults,
        });

        const messages = messagesResponse.data.messages || [];

        // Get detailed message data for each message
        const detailedMessages = await Promise.all(
            messages.map(async (message) => {
                try {
                    const messageDetails = await gmail.users.messages.get({
                        userId: 'me',
                        id: message.id!,
                        format: 'full',
                    });

                    const headers = messageDetails.data.payload?.headers || [];
                    const subject = headers.find(h => h.name === 'Subject')?.value || '';
                    const from = headers.find(h => h.name === 'From')?.value || '';
                    const to = headers.find(h => h.name === 'To')?.value || '';
                    const date = headers.find(h => h.name === 'Date')?.value || '';
                    const messageId = headers.find(h => h.name === 'Message-ID')?.value || '';
                    const inReplyTo = headers.find(h => h.name === 'In-Reply-To')?.value || '';
                    const references = headers.find(h => h.name === 'References')?.value || '';

                    // Extract text content
                    let textContent = '';
                    let htmlContent = '';

                    const extractContent = (parts: any[]): void => {
                        parts.forEach(part => {
                            if (part.mimeType === 'text/plain' && part.body?.data) {
                                textContent += Buffer.from(part.body.data, 'base64').toString('utf-8');
                            } else if (part.mimeType === 'text/html' && part.body?.data) {
                                htmlContent += Buffer.from(part.body.data, 'base64').toString('utf-8');
                            } else if (part.parts) {
                                extractContent(part.parts);
                            }
                        });
                    };

                    if (messageDetails.data.payload?.parts) {
                        extractContent(messageDetails.data.payload.parts);
                    } else if (messageDetails.data.payload?.body?.data) {
                        // Single part message
                        const mimeType = messageDetails.data.payload.mimeType;
                        const content = Buffer.from(messageDetails.data.payload.body.data, 'base64').toString('utf-8');
                        if (mimeType === 'text/plain') {
                            textContent = content;
                        } else if (mimeType === 'text/html') {
                            htmlContent = content;
                        }
                    }

                    // Determine if this is a reply to our sent email
                    const isReply = !!(inReplyTo || references);
                    
                    // Check if this is unread
                    const isUnread = messageDetails.data.labelIds?.includes('UNREAD') || false;

                    return {
                        id: message.id,
                        threadId: messageDetails.data.threadId,
                        subject,
                        from,
                        to,
                        date,
                        messageId,
                        inReplyTo,
                        references,
                        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Fallback to HTML stripped of tags
                        htmlContent,
                        isReply,
                        isUnread,
                        labelIds: messageDetails.data.labelIds || [],
                        snippet: messageDetails.data.snippet || '',
                    };
                } catch (error) {
                    console.error('Error fetching message details:', error);
                    return null;
                }
            })
        );

        // Filter out null results and return
        const validMessages = detailedMessages.filter(msg => msg !== null);

        return NextResponse.json({
            messages: validMessages,
            totalCount: messagesResponse.data.resultSizeEstimate || 0,
        });

    } catch (error: any) {
        console.error('Gmail API error:', error);
        
        if (error.code === 401) {
            return NextResponse.json({ error: 'Unauthorized', needsRefresh: true }, { status: 401 });
        }
        
        return NextResponse.json(
            { error: 'Failed to fetch Gmail messages', details: error.message },
            { status: 500 }
        );
    }
} 