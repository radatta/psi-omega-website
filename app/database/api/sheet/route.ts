import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import {
    SESSION_COOKIE,
    sessionConfig,
    verifySessionToken,
} from '@/lib/server/session';

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
    const config = sessionConfig();
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // Checked here rather than at module scope: a throw at import time fails
    // the whole production build, not just this route.
    if (!config || !sheetId || !credentialsJson) {
        console.error(
            'Missing DATABASE_PASSWORD, DATABASE_SESSION_SECRET, GOOGLE_SHEET_ID or GOOGLE_APPLICATION_CREDENTIALS'
        );
        return NextResponse.json(
            { error: 'not_configured' },
            { status: 503, headers: NO_STORE }
        );
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token, config)) {
        return NextResponse.json(
            { error: 'unauthorized' },
            { status: 401, headers: NO_STORE }
        );
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(credentialsJson),
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1!A1:O1000',
        });

        // Alumni contact details — never let a CDN or the browser hold a copy.
        return NextResponse.json(response.data.values, { headers: NO_STORE });
    } catch (error) {
        // Malformed credentials or a Google outage. Don't leak the reason.
        console.error('Sheet read failed', error);
        return NextResponse.json(
            { error: 'upstream_failure' },
            { status: 502, headers: NO_STORE }
        );
    }
}
