/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
// import { DataTable } from './DataTable'; // Old DataTable, will be replaced
import { getColumns } from './columns'; // Import from new columns.tsx
import { DataTable as ShadcnDataTable } from '@/components/database/data-table'; // New shadcn data-table component (to be created)

export default function Database() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(false); // For testing, default to true
    const [rawData, setRawData] = useState<any[][]>([]); // Renamed to rawData

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch('/database/api/check-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const dataRes = await res.json();
        if (dataRes.success) {
            setUnlocked(true);
        } else {
            setError('Incorrect password');
        }
    }

    useEffect(() => {
        if (unlocked) {
            fetch('/database/api/sheet')
                .then((res) => res.json())
                .then((fetchedData) => {
                    if (fetchedData && Array.isArray(fetchedData)) {
                        const filtered = fetchedData.filter(
                            (row: any, idx: number) =>
                                idx === 0 ||
                                (row && row[4] && String(row[4]).trim() !== '')
                        );
                        setRawData(filtered);
                    }
                });
        }
    }, [unlocked]);

    // Transform rawData (arrays) into data suitable for TanStack Table (array of objects)
    const processedData = useMemo(() => {
        if (!rawData || rawData.length < 1 || !rawData[0]) return [];
        const headers = rawData[0] as string[];
        return rawData.slice(1).map((row: any[]) => {
            const obj: Record<string, any> = {};
            headers.forEach((header: string, i: number) => {
                const key = header || `_col_${i}`;
                obj[key] =
                    row[i] !== undefined && row[i] !== null ? row[i] : '';
            });
            return obj;
        });
    }, [rawData]);

    const columns = useMemo(() => getColumns(rawData), [rawData]);

    return (
        <section
            id='database-section'
            className='py-16 min-h-screen bg-gray-50'
        >
            <div className='container mx-auto space-y-12 px-4'>
                {!unlocked ? (
                    <div className='flex justify-center items-center min-h-[calc(100vh-10rem)]'>
                        <form
                            onSubmit={handleSubmit}
                            className='w-full max-w-md p-8 space-y-6 shadow-xl rounded-lg bg-white'
                        >
                            <h2 className='text-3xl font-bold text-center text-gray-800'>
                                AKPsi Database Access
                            </h2>
                            <p className='text-center text-gray-600'>
                                Please enter the password to view the alumni
                                database.
                            </p>
                            <div>
                                <label htmlFor='password' className='sr-only'>
                                    Password
                                </label>
                                <input
                                    id='password'
                                    type='password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder='Password'
                                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow'
                                    required
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            >
                                Unlock Database
                            </button>
                            {error && (
                                <div className='text-red-600 text-sm text-center pt-2 font-medium'>
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    <div>
                        {/* <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Alumni Database</h2> */}
                        {processedData.length > 0 && columns.length > 0 ? (
                            // Replace with ShadcnDataTable once it's created
                            <ShadcnDataTable
                                columns={columns}
                                data={processedData}
                            />
                        ) : (
                            <div className='text-center py-10'>
                                <p className='text-gray-600 text-xl'>
                                    Loading data or no data available...
                                </p>
                                {/* Optional: Add a spinner here */}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
