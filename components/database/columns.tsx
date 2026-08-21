'use client';

import { ColumnDef, Column } from '@tanstack/react-table';
import { CheckCircle2, XCircle, HelpCircle, Coffee, Users } from 'lucide-react';
import React from 'react';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    ColumnSpec,
    buildColumnSpecs,
    linkHref,
    yesNoValue,
} from '@/lib/database/column-spec';
import type { SheetGrid, SheetRow } from '@/lib/database/sheet';

type Row = SheetRow;
type Def = ColumnDef<Row, unknown>;

const yesNoIcon = (value: unknown) => {
    switch (yesNoValue(value)) {
        case 'yes':
            return <CheckCircle2 className='h-5 w-5 text-green-500 mx-auto' />;
        case 'no':
            return <XCircle className='h-5 w-5 text-red-500 mx-auto' />;
        case 'maybe':
            return <HelpCircle className='h-5 w-5 text-yellow-500 mx-auto' />;
        default:
            return (
                <span className='block text-center'>
                    {String(value) || '-'}
                </span>
            );
    }
};

const iconFor = (icon: ColumnSpec['icon']) =>
    icon === 'coffee' ? (
        <Coffee className='h-6 w-6 mr-1' />
    ) : (
        <Users className='h-4 w-4 mr-1' />
    );

function toColumnDef(spec: ColumnSpec): Def {
    const def: Def = {
        id: spec.id,
        accessorKey: spec.id,
        header: () => spec.label ?? spec.header,
        cell: (info) => {
            const value = info.getValue();
            return value !== undefined && value !== null ? String(value) : '';
        },
        enableResizing: true,
        enableSorting: spec.sortable,
        enableHiding: true,
        ...spec.size,
    };

    if (spec.sortableHeader) {
        def.header = ({ column }: { column: Column<Row, unknown> }) => (
            <DataTableColumnHeader column={column} title={spec.header} />
        );
    }

    switch (spec.kind) {
        case 'rowNumber':
            def.cell = (info) => String(parseInt(info.row.id) + 1);
            break;
        case 'yesNo':
            def.header = () => (
                <div className='flex items-center'>
                    {iconFor(spec.icon)} {spec.label}
                </div>
            );
            def.cell = (info) => yesNoIcon(info.getValue());
            break;
        case 'link':
            def.cell = (info) => {
                const value = info.getValue();
                const href = linkHref(value);
                if (!href) return String(value);
                return (
                    <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 underline'
                    >
                        {String(value)}
                    </a>
                );
            };
            break;
    }

    return def;
}

export const getColumns = (data: SheetGrid): Def[] => {
    if (!data || data.length < 1 || !data[0]) return [];
    return buildColumnSpecs(data[0] as string[]).map(toColumnDef);
};
