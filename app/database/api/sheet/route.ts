import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import fs from 'fs';

if (
    !process.env.GOOGLE_SHEET_ID ||
    !process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
    throw new Error(
        'Missing GOOGLE_SHEET_ID or GOOGLE_APPLICATION_CREDENTIALS environment variable'
    );
}

export async function GET() {
    // Load credentials from JSON file
    const credentials = JSON.parse(
        fs.readFileSync(
            process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
            'utf8'
        )
    );

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Sheet1!A1:O1000'; // Adjust to your needs

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range,
    });

    return NextResponse.json(response.data.values);
}
