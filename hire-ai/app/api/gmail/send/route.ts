import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, subject, text, html, accessToken } = body;

        console.log('Gmail send request received:', {
            hasTo: !!to,
            toLength: Array.isArray(to) ? to.length : 'not array',
            hasSubject: !!subject,
            hasText: !!text,
            hasHtml: !!html,
            hasAccessToken: !!accessToken
        });

        if (!to || !subject || !accessToken) {
            console.error('Missing required fields:', { to: !!to, subject: !!subject, accessToken: !!accessToken });
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (Array.isArray(to) && to.length === 0) {
            console.error('Empty recipients array');
            return NextResponse.json(
                { success: false, error: 'No recipients specified' },
                { status: 400 }
            );
        }

        // Create OAuth2 client
        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
        );

        // Set credentials
        oauth2Client.setCredentials({
            access_token: accessToken
        });

        // Create Gmail API instance
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Get user's email address
        const profile = await gmail.users.getProfile({ userId: 'me' });
        const fromEmail = profile.data.emailAddress;

        // Create email message
        const message = createEmailMessage({
            to: Array.isArray(to) ? to : [to],
            from: fromEmail || '',
            subject,
            text,
            html
        });

        // Send email
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: message
            }
        });

        return NextResponse.json({
            success: true,
            messageId: result.data.id,
            threadId: result.data.threadId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
}

/**
 * Create RFC 2822 formatted email message
 */
function createEmailMessage({
    to,
    from,
    subject,
    text,
    html
}: {
    to: string[];
    from: string;
    subject: string;
    text?: string;
    html?: string;
}) {
    const toList = to.join(', ');
    
    let message = [
        `From: ${from}`,
        `To: ${toList}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0'
    ];

    if (html && text) {
        // Multipart message with both HTML and text
        const boundary = `boundary_${Date.now()}`;
        message.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
        message.push('');
        message.push(`--${boundary}`);
        message.push('Content-Type: text/plain; charset=UTF-8');
        message.push('');
        message.push(text);
        message.push('');
        message.push(`--${boundary}`);
        message.push('Content-Type: text/html; charset=UTF-8');
        message.push('');
        message.push(html);
        message.push('');
        message.push(`--${boundary}--`);
    } else if (html) {
        // HTML only
        message.push('Content-Type: text/html; charset=UTF-8');
        message.push('');
        message.push(html);
    } else {
        // Text only
        message.push('Content-Type: text/plain; charset=UTF-8');
        message.push('');
        message.push(text || '');
    }

    // Encode message in base64url format
    const emailContent = message.join('\r\n');
    const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
} 