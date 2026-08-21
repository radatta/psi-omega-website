import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/utils/session';

export async function GET(request: NextRequest) {
    const password = process.env.DATABASE_PASSWORD;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // Checked here rather than at module scope: a throw at import time fails
    // the whole production build, not just this route.
    if (!password || !sheetId || !credentialsJson) {
        console.error(
            'Missing DATABASE_PASSWORD, GOOGLE_SHEET_ID or GOOGLE_APPLICATION_CREDENTIALS'
        );
        return NextResponse.json(
            { error: 'not_configured' },
            { status: 503, headers: { 'Cache-Control': 'no-store' } }
        );
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token, password)) {
        return NextResponse.json(
            { error: 'unauthorized' },
            { status: 401, headers: { 'Cache-Control': 'no-store' } }
        );
    }

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsJson),
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'Sheet1!A1:O1000';

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });

    // Alumni contact details — never let a CDN or the browser hold a copy.
    return NextResponse.json(response.data.values, {
        headers: { 'Cache-Control': 'no-store' },
    });
}
