import { describe, expect, test } from 'bun:test';
import { getColumns } from '@/components/database/columns';

// The real header row, in sheet order.
const headers = [
    '',
    'LAST',
    'FIRST',
    'YEAR + PC ',
    'EMAIL',
    'MAJOR',
    'MINORS',
    'GRAD YEAR',
    'ROLE',
    'COMPANY',
    'LOCATION',
    'INDUSTRY',
    'LINKEDIN',
    'Open to coffee chats?',
    'Open to alumni panel?',
];

const columns = getColumns([headers]);
const byId = (id: string) => columns.find((column) => column.id === id);

describe('getColumns', () => {
    test('returns nothing without a header row', () => {
        expect(getColumns([])).toEqual([]);
        expect(getColumns([[]])).toEqual([]);
    });

    test('emits one column per header, EMAIL first', () => {
        expect(columns).toHaveLength(headers.length);
        expect(columns[0]?.id).toBe('EMAIL');
    });

    test('every column id is unique', () => {
        const ids = columns.map((column) => column.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    // Sizes and flags are easy to lose in a refactor and invisible until
    // someone opens the table, so they are pinned here.
    test('pins the sized columns', () => {
        expect(byId('EMAIL')).toMatchObject({
            size: 220,
            minSize: 120,
            maxSize: 400,
        });
        expect(byId('_col_0')).toMatchObject({
            size: 60,
            minSize: 40,
            maxSize: 100,
        });
        expect(byId('GRAD YEAR')).toMatchObject({
            size: 100,
            minSize: 70,
            maxSize: 150,
        });
        expect(byId('Open to coffee chats?')).toMatchObject({
            size: 100,
            minSize: 80,
            maxSize: 180,
        });
        expect(byId('Open to alumni panel?')).toMatchObject({
            size: 100,
            minSize: 80,
            maxSize: 180,
        });
    });

    test('leaves the unsized columns unsized', () => {
        for (const id of ['LAST', 'FIRST', 'COMPANY', 'LINKEDIN']) {
            expect(byId(id)?.size).toBeUndefined();
        }
    });

    test('pins which columns can be sorted', () => {
        const sortable = columns
            .filter((column) => column.enableSorting)
            .map((column) => column.id);
        expect(sortable.sort()).toEqual(
            [
                'EMAIL',
                'LAST',
                'FIRST',
                'YEAR + PC ',
                'MAJOR',
                'MINORS',
                'GRAD YEAR',
                'ROLE',
                'COMPANY',
                'LOCATION',
                'INDUSTRY',
            ].sort()
        );
    });

    test('every column is resizable and hideable', () => {
        for (const column of columns) {
            expect(column.enableResizing).toBe(true);
            expect(column.enableHiding).toBe(true);
        }
    });
});
