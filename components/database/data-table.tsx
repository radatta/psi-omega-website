/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
'use client';

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnSizingState,
    SortingState,
    VisibilityState,
    ColumnPinningState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
// Reusable UI components from shadcn/ui examples
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { DataTableViewOptions } from '@/components/ui/data-table-view-options';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends object, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
        {}
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({ _col_0: false });
    const [columnPinning, setColumnPinning] =
        React.useState<ColumnPinningState>({ left: ['EMAIL'] });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnSizing,
            columnVisibility,
            columnPinning,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnSizingChange: setColumnSizing,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        getRowId: (row, index) => String(index),
        defaultColumn: {
            minSize: 50,
            size: 150,
            maxSize: 500,
            enableResizing: true,
            // enableSorting and enableHiding are now controlled in columns.tsx
        },
    });

    return (
        <div>
            <div className='flex flex-col items-stretch gap-4 py-4 md:flex-row md:items-center md:justify-between'>
                <Input
                    placeholder='Search all columns...'
                    value={globalFilter ?? ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setGlobalFilter(event.target.value)
                    }
                    className='w-full md:w-auto md:max-w-xs lg:max-w-sm'
                />
                <DataTableViewOptions table={table} />
            </div>
            <div className='rounded-md border overflow-x-auto'>
                <Table
                    style={{
                        width: table.getCenterTotalSize(),
                        tableLayout: 'fixed',
                    }}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const { column } = header;
                                    const isPinned = column.getIsPinned();
                                    const isLastLeftPinned =
                                        isPinned === 'left' &&
                                        column.getIsLastColumn('left');

                                    const headerStyles: React.CSSProperties = {
                                        width: header.getSize(),
                                    };
                                    if (isPinned) {
                                        headerStyles.position = 'sticky';
                                        headerStyles.left =
                                            isPinned === 'left'
                                                ? column.getStart('left')
                                                : undefined;
                                        headerStyles.right =
                                            isPinned === 'right'
                                                ? column.getAfter('right')
                                                : undefined;
                                        headerStyles.zIndex = 1;
                                        headerStyles.backgroundColor =
                                            'hsl(var(--background))';
                                        if (isLastLeftPinned) {
                                            headerStyles.boxShadow =
                                                '4px 0 4px -2px rgba(0, 0, 0, 0.05)';
                                        }
                                    }

                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={headerStyles}
                                            className='relative border-r border-b border-gray-300 last:border-r-0 h-12 PADDING_FOR_HEADER_CONTENT_HERE'
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                            {header.column.getCanResize() && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    role='separator'
                                                    aria-orientation='vertical'
                                                    className={`absolute top-0 right-[-2.5px] h-full w-[5px] cursor-col-resize select-none touch-none bg-gray-200 hover:bg-blue-500 active:bg-blue-600 ${header.column.getIsResizing() ? 'bg-blue-600' : ''}`}
                                                />
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    className='even:bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-300 transition-colors'
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const { column } = cell;
                                        const isPinned = column.getIsPinned();
                                        const isLastLeftPinned =
                                            isPinned === 'left' &&
                                            column.getIsLastColumn('left');

                                        const cellStyles: React.CSSProperties =
                                            {
                                                width: column.getSize(),
                                            };

                                        if (isPinned) {
                                            cellStyles.position = 'sticky';
                                            cellStyles.left =
                                                isPinned === 'left'
                                                    ? column.getStart('left')
                                                    : undefined;
                                            cellStyles.right =
                                                isPinned === 'right'
                                                    ? column.getAfter('right')
                                                    : undefined;
                                            cellStyles.backgroundColor =
                                                'hsl(var(--background))';
                                            if (isLastLeftPinned) {
                                                cellStyles.boxShadow =
                                                    '4px 0 4px -2px rgba(0, 0, 0, 0.05)';
                                            }
                                        }

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                style={cellStyles}
                                                className='p-2 border-r border-gray-200 last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap h-10'
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
