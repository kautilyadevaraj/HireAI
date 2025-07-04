import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { refreshToken } = body;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: 'Refresh token is required' },
                { status: 400 }
            );
        }

        // Dynamically determine redirect URI
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                           `${request.nextUrl.origin}/api/gmail/callback`;

        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        // Refresh the access token
        const { credentials } = await oauth2Client.refreshAccessToken();

        return NextResponse.json({
            success: true,
            accessToken: credentials.access_token,
            expiryDate: credentials.expiry_date
        });

    } catch (error) {
        console.error('Error refreshing Gmail token:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to refresh token' 
            },
            { status: 500 }
        );
    }
} 