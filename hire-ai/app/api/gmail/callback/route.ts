import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

async function exchangeCodeForTokens(code: string, redirectUri: string) {
    try {
        console.log('Exchanging code for tokens...');
        const oauth2Client = new OAuth2Client(
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri
        );

        const { tokens } = await oauth2Client.getToken(code);
        console.log('Tokens received:', { 
            hasAccessToken: !!tokens.access_token,
            hasRefreshToken: !!tokens.refresh_token,
            expiryDate: tokens.expiry_date 
        });
        
        return {
            success: true,
            tokens
        };
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log('Gmail callback GET request received');
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        
        // Dynamically determine redirect URI
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                           `${request.nextUrl.origin}/api/gmail/callback`;

        console.log('Callback params:', { 
            hasCode: !!code, 
            error, 
            state,
            origin: request.nextUrl.origin,
            redirectUri: redirectUri
        });

        if (error) {
            console.error('Gmail OAuth error:', error);
            return NextResponse.redirect(
                new URL('/outreach?tab=compose&gmail_error=access_denied', request.url)
            );
        }

        if (!code) {
            console.error('No authorization code received');
            return NextResponse.redirect(
                new URL('/outreach?tab=compose&gmail_error=no_code', request.url)
            );
        }

        const result = await exchangeCodeForTokens(code, redirectUri);

        if (result.success && result.tokens) {
            console.log('Token exchange successful, creating HTML redirect...');
            
            // Create an HTML page that stores tokens and redirects
            const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Gmail Connected</title>
    <script>
        // Store tokens in sessionStorage temporarily
        sessionStorage.setItem('gmail_tokens', JSON.stringify({
            access_token: "${result.tokens.access_token}",
            refresh_token: "${result.tokens.refresh_token}",
            expiry_date: ${result.tokens.expiry_date || Date.now() + 3600000}
        }));
        
        // Redirect to outreach page
        window.location.href = '/outreach?tab=compose&gmail_auth=success';
    </script>
</head>
<body>
    <p>Gmail connected successfully! Redirecting...</p>
</body>
</html>`;
            
            return new NextResponse(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        } else {
            console.error('Failed to exchange code for tokens:', result.error);
            return NextResponse.redirect(
                new URL('/outreach?tab=compose&gmail_error=token_exchange_failed', request.url)
            );
        }

    } catch (error) {
        console.error('Gmail callback error:', error);
        return NextResponse.redirect(
            new URL('/outreach?tab=compose&gmail_error=unknown', request.url)
        );
    }
}

// Handle POST requests from client-side hook
export async function POST(request: NextRequest) {
    try {
        console.log('Gmail callback POST request received');
        const body = await request.json();
        const { code } = body;
        
        // Dynamically determine redirect URI
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
                           `${request.nextUrl.origin}/api/gmail/callback`;

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'Authorization code is required' },
                { status: 400 }
            );
        }

        const result = await exchangeCodeForTokens(code, redirectUri);
        return NextResponse.json(result);

    } catch (error) {
        console.error('Gmail callback POST error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
            },
            { status: 500 }
        );
    }
} 