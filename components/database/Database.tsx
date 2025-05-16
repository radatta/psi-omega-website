'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

export default function Database() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [unlocked, setUnlocked] = useState(true);
    const [data, setData] = useState<any[][]>([]);

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
                        setData(filtered);
                    }
                });
        }
    }, [unlocked]);

    const tableData = React.useMemo(() => {
        if (!data || data.length < 1 || !data[0]) return [];
        const headers = data[0] as string[];
        return data.slice(1).map((row: any[]) => {
            const obj: Record<string, any> = {};
            headers.forEach((header: string, i: number) => {
                const key = header || `_col_${i}`;
                obj[key] =
                    row[i] !== undefined && row[i] !== null ? row[i] : '';
            });
            return obj;
        });
    }, [data]);

    const columns = React.useMemo<ColumnDef<any, any>[]>(() => {
        if (!data || data.length < 1 || !data[0]) return [];
        const headers = data[0] as string[];
        return headers.map((originalHeader: string, i: number) => {
            const accessor = originalHeader || `_col_${i}`;
            return {
                id: accessor,
                accessorKey: accessor,
                header: originalHeader,
                cell: (info: any) => {
                    const value = info.getValue();
                    let displayValue =
                        value !== undefined && value !== null
                            ? String(value)
                            : '';
                    if (accessor === '_col_0') {
                        displayValue = `${Number(info.row.id) + 1}`;
                    }
                    return displayValue;
                },
            };
        });
    }, [data]);

    return (
        <section id='database-section' className='py-16 min-h-screen'>
            <div className='container space-y-12'>
                {!unlocked ? (
                    <form
                        onSubmit={handleSubmit}
                        className='space-y-4 max-w-sm mx-auto p-6 shadow-lg rounded-lg bg-white'
                    >
                        <h2 className='text-2xl font-semibold text-center text-gray-700 mb-4'>
                            Enter Password
                        </h2>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                            required
                        />
                        <button
                            type='submit'
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out'
                        >
                            Unlock Database
                        </button>
                        {error && (
                            <div className='text-red-500 text-sm text-center mt-2'>
                                {error}
                            </div>
                        )}
                    </form>
                ) : (
                    <div className='text-center'>
                        <h2 className='text-3xl font-bold text-green-600 mb-6'>
                            Access Granted!
                        </h2>
                        {tableData.length > 0 && columns.length > 0 ? (
                            <DataTable columns={columns} data={tableData} />
                        ) : (
                            <p className='text-gray-600'>
                                Loading data or no data available...
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
