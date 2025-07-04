import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
    try {
        const { messageId, accessToken, refreshToken } = await request.json();
        
        if (!messageId || !accessToken) {
            return NextResponse.json({ error: 'Message ID and access token required' }, { status: 400 });
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

        // Remove the UNREAD label from the message
        await gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
                removeLabelIds: ['UNREAD']
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Gmail mark read error:', error);
        
        if (error.code === 401) {
            return NextResponse.json({ error: 'Unauthorized', needsRefresh: true }, { status: 401 });
        }
        
        return NextResponse.json(
            { error: 'Failed to mark message as read', details: error.message },
            { status: 500 }
        );
    }
} 