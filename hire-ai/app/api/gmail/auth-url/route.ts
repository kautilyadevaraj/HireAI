import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function GET() {
    try {
        console.log('Gmail auth URL request received');
        console.log('Environment variables:', {
            hasClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            hasRedirectUri: !!process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
            redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
        });

        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
        );

        const scopes = [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });

        console.log('Generated auth URL:', authUrl);
        return NextResponse.json({ success: true, authUrl });
    } catch (error) {
        console.error('Error generating auth URL:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate auth URL' },
            { status: 500 }
        );
    }
} 