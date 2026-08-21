import { columnKey } from './sheet';

// Which column a sheet header turns into. The rendering lives in
// components/database/columns.tsx; the decisions live here so they can be
// tested and so the special-cased header strings are all in one place.
//
// These match the spreadsheet's header text exactly. Renaming a column in the
// sheet silently drops it back to a plain column — there is no error.

export type ColumnKind =
    'rowNumber' | 'email' | 'yesNo' | 'link' | 'gradYear' | 'plain';

export interface ColumnSize {
    size: number;
    minSize: number;
    maxSize: number;
}

export interface ColumnSpec {
    id: string;
    header: string;
    kind: ColumnKind;
    sortable: boolean;
    // Whether to render the sortable header control rather than plain text.
    sortableHeader: boolean;
    label?: string;
    icon?: 'coffee' | 'users';
    size?: ColumnSize;
}

const SORTABLE_HEADERS = [
    'LAST',
    'FIRST',
    'YEAR + PC',
    'MAJOR',
    'MINORS',
    'COMPANY',
    'LOCATION',
    'INDUSTRY',
    'ROLE',
];

export function describeColumn(header: string, index: number): ColumnSpec {
    // The id must use the RAW header — it is the key the row objects are built
    // with, so trimming it here would stop cells resolving. Matching, though,
    // ignores surrounding whitespace: the live sheet's 'YEAR + PC ' has a
    // trailing space and was silently missing its sortable header control.
    const id = columnKey(header, index);
    const trimmed = header.trim();
    const upper = trimmed.toUpperCase();

    if (id === '_col_0') {
        return {
            id,
            header,
            kind: 'rowNumber',
            sortable: false,
            sortableHeader: false,
            label: '#',
            size: { size: 60, minSize: 40, maxSize: 100 },
        };
    }

    if (upper === 'EMAIL') {
        return {
            id,
            header,
            kind: 'email',
            sortable: true,
            sortableHeader: true,
            size: { size: 220, minSize: 120, maxSize: 400 },
        };
    }

    if (trimmed === 'GRAD YEAR') {
        return {
            id,
            header,
            kind: 'gradYear',
            sortable: true,
            sortableHeader: true,
            size: { size: 100, minSize: 70, maxSize: 150 },
        };
    }

    if (
        trimmed === 'Open to coffee chats?' ||
        trimmed === 'Open to alumni panel?'
    ) {
        return {
            id,
            header,
            kind: 'yesNo',
            sortable: false,
            sortableHeader: false,
            label:
                trimmed === 'Open to coffee chats?'
                    ? 'Coffee Chats'
                    : 'Alumni Panel',
            icon: trimmed === 'Open to coffee chats?' ? 'coffee' : 'users',
            size: { size: 100, minSize: 80, maxSize: 180 },
        };
    }

    if (trimmed === 'LINKEDIN') {
        return {
            id,
            header,
            kind: 'link',
            sortable: false,
            sortableHeader: false,
            label: 'LinkedIn',
        };
    }

    return {
        id,
        header,
        kind: 'plain',
        sortable: true,
        sortableHeader: SORTABLE_HEADERS.includes(upper),
    };
}

// EMAIL is hoisted to the first column wherever it appears in the sheet.
//
// Repeated headers are collapsed to their first occurrence. Duplicate ids are
// an error in TanStack Table, and a sheet with two columns of the same name is
// a spreadsheet mistake rather than something to render twice.
export function buildColumnSpecs(headers: string[]): ColumnSpec[] {
    const seen = new Set<string>();
    const specs = headers.map(describeColumn).filter((spec) => {
        if (seen.has(spec.id)) return false;
        seen.add(spec.id);
        return true;
    });

    // Only one EMAIL column survives, even if the sheet spells a second one
    // differently ('EMAIL' and 'Email' are distinct ids but the same column).
    const email = specs.find((spec) => spec.kind === 'email');
    if (!email) return specs;
    return [email, ...specs.filter((spec) => spec.kind !== 'email')];
}

// Normalises a yes/no/maybe cell. Anything else renders as-is.
export function yesNoValue(value: unknown): 'yes' | 'no' | 'maybe' | 'other' {
    const normalised = String(value).toLowerCase();
    if (normalised === 'yes' || normalised === 'no' || normalised === 'maybe') {
        return normalised;
    }
    return 'other';
}

// LinkedIn cells are hand-typed, so some are bare `www.` with no scheme.
export function linkHref(value: unknown): string | null {
    const url = String(value);
    if (url.startsWith('http')) return url;
    if (url.startsWith('www.')) return `https://${url}`;
    return null;
}
