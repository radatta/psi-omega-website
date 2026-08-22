'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getColumns } from './columns';
import { DataTable as ShadcnDataTable } from '@/components/database/data-table';
import {
    SheetGrid,
    filterPopulatedRows,
    toRowObjects,
} from '@/lib/database/sheet';

export default function Database() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(false);
    const [rawData, setRawData] = useState<SheetGrid>([]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch('/database/api/check-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            setPassword('');
            setUnlocked(true);
        } else if (res.status === 503) {
            setError('The database is not configured. Contact an admin.');
        } else {
            setError('Incorrect password');
        }
    }

    useEffect(() => {
        if (!unlocked) return;
        fetch('/database/api/sheet')
            .then((res) => {
                // The session cookie is the real gate; if it is missing or
                // expired the server says so and we drop back to the form.
                if (res.status === 401) {
                    setUnlocked(false);
                    setError('Your session expired. Please log in again.');
                    return null;
                }
                if (!res.ok) throw new Error(`sheet request ${res.status}`);
                return res.json();
            })
            .then((fetchedData) => {
                if (fetchedData && Array.isArray(fetchedData)) {
                    setRawData(filterPopulatedRows(fetchedData));
                }
            })
            .catch(() => setError('Could not load the database.'));
    }, [unlocked]);

    const processedData = useMemo(() => toRowObjects(rawData), [rawData]);

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
                        {processedData.length > 0 && columns.length > 0 ? (
                            <ShadcnDataTable
                                columns={columns}
                                data={processedData}
                            />
                        ) : (
                            <div className='text-center py-10'>
                                <p className='text-gray-600 text-xl'>
                                    Loading data or no data available...
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
