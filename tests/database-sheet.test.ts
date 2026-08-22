import { describe, expect, test } from 'bun:test';
import {
    columnKey,
    filterPopulatedRows,
    toRowObjects,
} from '@/lib/database/sheet';
import {
    buildColumnSpecs,
    describeColumn,
    linkHref,
    yesNoValue,
} from '@/lib/database/column-spec';

// A grid shaped like the real sheet: the required column is index 4.
const grid = [
    ['', 'LAST', 'FIRST', 'GRAD YEAR', 'EMAIL', 'Open to coffee chats?'],
    ['1', 'Doe', 'Jane', '2024', 'jane@example.com', 'Yes'],
    ['2', 'Roe', 'Rick', '2023', '', 'No'],
    ['3', 'Poe', 'Pat', '2022', '   ', 'Maybe'],
];

describe('columnKey', () => {
    test('uses the header when there is one', () => {
        expect(columnKey('EMAIL', 3)).toBe('EMAIL');
    });

    test('falls back to a positional key for blank headers', () => {
        expect(columnKey('', 0)).toBe('_col_0');
        expect(columnKey('', 7)).toBe('_col_7');
    });
});

describe('filterPopulatedRows', () => {
    test('keeps the header row regardless', () => {
        expect(filterPopulatedRows(grid)[0]).toEqual(grid[0]);
    });

    test('drops rows whose required column is falsy', () => {
        const rows = [grid[0], ['x', '', '', '', 0], ['y', '', '', '', false]];
        expect(filterPopulatedRows(rows)).toHaveLength(1);
    });

    test('drops rows whose required column is empty or whitespace', () => {
        const kept = filterPopulatedRows(grid);
        expect(kept).toHaveLength(2);
        expect(kept[1][2]).toBe('Jane');
    });

    test('survives short and missing rows', () => {
        const ragged = [grid[0], ['1'], [], undefined as never];
        expect(filterPopulatedRows(ragged)).toHaveLength(1);
    });
});

describe('toRowObjects', () => {
    test('keys each row by its header', () => {
        const [first] = toRowObjects(grid);
        expect(first.LAST).toBe('Doe');
        expect(first.EMAIL).toBe('jane@example.com');
    });

    test('gives blank headers a positional key', () => {
        expect(toRowObjects(grid)[0]._col_0).toBe('1');
    });

    test('fills missing cells with an empty string', () => {
        const rows = toRowObjects([['A', 'B'], ['only-a']]);
        expect(rows[0]).toEqual({ A: 'only-a', B: '' });
    });

    test('returns nothing for an empty or headerless grid', () => {
        expect(toRowObjects([])).toEqual([]);
        expect(toRowObjects([[]])).toEqual([]);
    });

    test('returns no rows when only a header is present', () => {
        expect(toRowObjects([grid[0]])).toEqual([]);
    });
});

describe('describeColumn', () => {
    test('makes the first blank header a row-number column', () => {
        const spec = describeColumn('', 0);
        expect(spec.kind).toBe('rowNumber');
        expect(spec.sortable).toBe(false);
        expect(spec.label).toBe('#');
    });

    test('recognises EMAIL case-insensitively', () => {
        expect(describeColumn('EMAIL', 4).kind).toBe('email');
        expect(describeColumn('Email', 4).kind).toBe('email');
    });

    test('recognises the two yes/no columns', () => {
        expect(describeColumn('Open to coffee chats?', 5)).toMatchObject({
            kind: 'yesNo',
            icon: 'coffee',
            label: 'Coffee Chats',
        });
        expect(describeColumn('Open to alumni panel?', 6)).toMatchObject({
            kind: 'yesNo',
            icon: 'users',
            label: 'Alumni Panel',
        });
    });

    test('recognises LINKEDIN', () => {
        expect(describeColumn('LINKEDIN', 7)).toMatchObject({
            kind: 'link',
            label: 'LinkedIn',
            sortable: false,
        });
    });

    test('gives known headers a sortable header control', () => {
        expect(describeColumn('COMPANY', 8).sortableHeader).toBe(true);
        expect(describeColumn('GRAD YEAR', 3).kind).toBe('gradYear');
    });

    test('falls back to a plain sortable column', () => {
        const spec = describeColumn('NOTES', 9);
        expect(spec.kind).toBe('plain');
        expect(spec.sortable).toBe(true);
        expect(spec.sortableHeader).toBe(false);
    });

    // The documented failure mode: renaming a column in the spreadsheet
    // silently degrades it rather than erroring.
    test('a renamed special column degrades to plain', () => {
        expect(describeColumn('Coffee chats', 5).kind).toBe('plain');
    });
});

describe('buildColumnSpecs', () => {
    test('hoists EMAIL to the front', () => {
        const specs = buildColumnSpecs(grid[0]);
        expect(specs[0].kind).toBe('email');
        expect(specs).toHaveLength(grid[0].length);
    });

    test('keeps the other columns in sheet order', () => {
        const ids = buildColumnSpecs(grid[0]).map((spec) => spec.id);
        expect(ids).toEqual([
            'EMAIL',
            '_col_0',
            'LAST',
            'FIRST',
            'GRAD YEAR',
            'Open to coffee chats?',
        ]);
    });

    test('collapses a duplicate EMAIL column rather than repeating the id', () => {
        const ids = buildColumnSpecs(['EMAIL', 'LAST', 'EMAIL']).map(
            (spec) => spec.id
        );
        expect(ids).toEqual(['EMAIL', 'LAST']);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('matches special headers despite stray whitespace', () => {
        // The real sheet has 'YEAR + PC ' with a trailing space.
        expect(describeColumn('YEAR + PC ', 3).sortableHeader).toBe(true);
        expect(describeColumn(' LINKEDIN ', 4).kind).toBe('link');
        expect(describeColumn('Open to coffee chats? ', 5).kind).toBe('yesNo');
        // ...but the id keeps the raw header, because it is the data key.
        expect(describeColumn('YEAR + PC ', 3).id).toBe('YEAR + PC ');
    });

    test('keeps only one EMAIL column however it is spelled', () => {
        const specs = buildColumnSpecs(['EMAIL', 'LAST', 'Email']);
        expect(specs.filter((s) => s.kind === 'email')).toHaveLength(1);
        expect(specs.map((s) => s.id)).toEqual(['EMAIL', 'LAST']);
    });

    test('collapses any repeated header, not just EMAIL', () => {
        const ids = buildColumnSpecs(['', 'ROLE', 'LAST', 'ROLE']).map(
            (spec) => spec.id
        );
        expect(ids).toEqual(['_col_0', 'ROLE', 'LAST']);
    });

    test('leaves order alone when there is no EMAIL column', () => {
        const ids = buildColumnSpecs(['LAST', 'FIRST']).map((spec) => spec.id);
        expect(ids).toEqual(['LAST', 'FIRST']);
    });
});

describe('cell helpers', () => {
    test('yesNoValue normalises case', () => {
        expect(yesNoValue('Yes')).toBe('yes');
        expect(yesNoValue('NO')).toBe('no');
        expect(yesNoValue('Maybe')).toBe('maybe');
        expect(yesNoValue('')).toBe('other');
        expect(yesNoValue('sure')).toBe('other');
    });

    test('linkHref accepts http and bare www', () => {
        expect(linkHref('https://linkedin.com/in/x')).toBe(
            'https://linkedin.com/in/x'
        );
        expect(linkHref('www.linkedin.com/in/x')).toBe(
            'https://www.linkedin.com/in/x'
        );
    });

    test('linkHref rejects anything else', () => {
        expect(linkHref('')).toBeNull();
        expect(linkHref('n/a')).toBeNull();
        expect(linkHref('linkedin.com/in/x')).toBeNull();
    });
});
