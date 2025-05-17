/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    ColumnSizingState,
} from '@tanstack/react-table';

interface DataTableProps<T extends object> {
    columns: ColumnDef<T, any>[];
    data: T[];
}

export function DataTable<T extends object>({
    columns,
    data,
}: DataTableProps<T>) {
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
        {}
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            columnSizing,
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        onColumnSizingChange: setColumnSizing,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: (row, index) => String(index),
        defaultColumn: {
            minSize: 50,
            size: 150,
            maxSize: 500,
        },
    });

    return (
        <div className='p-2'>
            <div className='flex items-center gap-2 mb-2'>
                <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder='Search...'
                    className='border rounded px-2 py-1'
                />
            </div>
            <div className='overflow-x-auto rounded shadow'>
                <table
                    className='min-w-full divide-y divide-gray-200 bg-white table-fixed'
                    style={{ width: table.getCenterTotalSize() }}
                >
                    <thead className='bg-gray-100'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{ width: header.getSize() }}
                                        className='relative px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border border-gray-300'
                                    >
                                        <div
                                            onClick={header.column.getToggleSortingHandler()}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' ||
                                                    e.key === ' '
                                                ) {
                                                    header.column.getToggleSortingHandler()?.(
                                                        e
                                                    );
                                                }
                                            }}
                                            role='button'
                                            tabIndex={0}
                                            className={`flex-grow ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <span className='ml-1'>
                                                {header.column.getIsSorted() ===
                                                'asc'
                                                    ? ' ▲'
                                                    : header.column.getIsSorted() ===
                                                        'desc'
                                                      ? ' ▼'
                                                      : header.column.getCanSort()
                                                        ? ' ▼'
                                                        : ''}
                                            </span>
                                        </div>

                                        {header.column.getCanResize() && (
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                role='separator'
                                                aria-orientation='vertical'
                                                className={`absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 select-none touch-none`}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className='hover:bg-blue-50'>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{ width: cell.column.getSize() }}
                                        className='px-4 py-2 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap border-r border-gray-300'
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex items-center justify-between mt-2'>
                <div className='space-x-1'>
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-50'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-50'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-50'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className='px-2 py-1 border rounded disabled:opacity-50'
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
                <span className='text-sm'>
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <select
                    className='border rounded px-2 py-1'
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
