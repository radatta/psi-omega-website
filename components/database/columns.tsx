/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { CheckCircle2, XCircle, HelpCircle, Coffee, Users } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

// Define a type for your row data if you have one, otherwise use `any` for now.
// export type YourDataType = { ... };

export const getColumns = (data: any[][]): ColumnDef<any, any>[] => {
    if (!data || data.length < 1 || !data[0]) return [];
    const headers = data[0] as string[];

    let emailColumn: ColumnDef<any, any> | undefined;
    const otherColumns: ColumnDef<any, any>[] = [];

    headers.forEach((originalHeader: string, i: number) => {
        const accessor = originalHeader || `_col_${i}`;

        const columnDef: ColumnDef<any, any> = {
            id: accessor,
            accessorKey: accessor,
            header: () => {
                return originalHeader;
            },
            cell: (info: any) => {
                const value = info.getValue();
                return value !== undefined && value !== null
                    ? String(value)
                    : '';
            },
            enableResizing: true,
            enableSorting: true,
            enableHiding: true,
        };

        if (accessor === '_col_0') {
            columnDef.header = () => '#';
            columnDef.cell = (info: any) => String(parseInt(info.row.id) + 1);
            columnDef.size = 60;
            columnDef.minSize = 40;
            columnDef.maxSize = 100;
            columnDef.enableSorting = false;
        }

        const standardSortableHeaders = [
            'LAST',
            'FIRST',
            'YEAR + PC',
            'MAJOR',
            'MINORS',
            'COMPANY',
            'LOCATION',
            'INDUSTRY',
        ];

        if (originalHeader.toUpperCase() === 'EMAIL') {
            columnDef.header = ({ column }: { column: Column<any, any> }) => (
                <DataTableColumnHeader column={column} title={originalHeader} />
            );
            emailColumn = columnDef;
            return;
        }

        if (standardSortableHeaders.includes(originalHeader.toUpperCase())) {
            columnDef.header = ({ column }: { column: Column<any, any> }) => (
                <DataTableColumnHeader column={column} title={originalHeader} />
            );
        }

        if (originalHeader === 'GRAD YEAR') {
            columnDef.header = ({ column }: { column: Column<any, any> }) => (
                <DataTableColumnHeader column={column} title={originalHeader} />
            );
            columnDef.size = 100;
            columnDef.minSize = 70;
            columnDef.maxSize = 150;
        }

        if (originalHeader === 'Open to coffee chats?') {
            columnDef.header = () => (
                <div className='flex items-center'>
                    <Coffee className='h-6 w-6 mr-1' /> Coffee Chats
                </div>
            );
            columnDef.cell = (info: any) => {
                const value = String(info.getValue()).toLowerCase();
                switch (value) {
                    case 'yes':
                        return (
                            <CheckCircle2 className='h-5 w-5 text-green-500 mx-auto' />
                        );
                    case 'no':
                        return (
                            <XCircle className='h-5 w-5 text-red-500 mx-auto' />
                        );
                    case 'maybe':
                        return (
                            <HelpCircle className='h-5 w-5 text-yellow-500 mx-auto' />
                        );
                    default:
                        return (
                            <span className='block text-center'>
                                {value || '-'}
                            </span>
                        );
                }
            };
            columnDef.size = 100;
            columnDef.minSize = 80;
            columnDef.maxSize = 180;
            columnDef.enableSorting = false;
        }

        if (originalHeader === 'Open to alumni panel?') {
            columnDef.header = () => (
                <div className='flex items-center'>
                    <Users className='h-4 w-4 mr-1' /> Alumni Panel
                </div>
            );
            columnDef.cell = (info: any) => {
                const value = String(info.getValue()).toLowerCase();
                switch (value) {
                    case 'yes':
                        return (
                            <CheckCircle2 className='h-5 w-5 text-green-500 mx-auto' />
                        );
                    case 'no':
                        return (
                            <XCircle className='h-5 w-5 text-red-500 mx-auto' />
                        );
                    case 'maybe':
                        return (
                            <HelpCircle className='h-5 w-5 text-yellow-500 mx-auto' />
                        );
                    default:
                        return (
                            <span className='block text-center'>
                                {value || '-'}
                            </span>
                        );
                }
            };
            columnDef.size = 100;
            columnDef.minSize = 80;
            columnDef.maxSize = 180;
            columnDef.enableSorting = false;
        }

        if (originalHeader === 'LINKEDIN') {
            columnDef.header = () => 'LinkedIn';
            columnDef.cell = (info: any) => {
                const url = String(info.getValue());
                if (url && (url.startsWith('http') || url.startsWith('www.'))) {
                    return (
                        <a
                            href={
                                url.startsWith('www.') ? `https://${url}` : url
                            }
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:text-blue-800 underline'
                        >
                            {url}
                        </a>
                    );
                }
                return url;
            };
            columnDef.enableSorting = false;
        }

        if (originalHeader.toUpperCase() !== 'EMAIL') {
            otherColumns.push(columnDef);
        }
    });

    return emailColumn ? [emailColumn, ...otherColumns] : otherColumns;
};
