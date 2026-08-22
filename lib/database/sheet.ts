// Pure transforms for the alumni sheet. The Google Sheets API hands back a
// plain grid of strings with the header row first; everything the table needs
// is derived from that here so it can be tested without a browser.

export type SheetGrid = unknown[][];
// Values are kept as they arrive rather than stringified here — the table sorts
// on these, and coercing early would change the ordering.
export type SheetRow = Record<string, unknown>;

// Blank headers still need a stable key, or every empty column would collide.
export const columnKey = (header: string, index: number) =>
    header || `_col_${index}`;

// The sheet keeps trailing blank rows and half-filled drafts. A row only counts
// as real if this column is filled in. Positional and brittle — it does not
// follow the header if someone reorders the spreadsheet.
export const REQUIRED_COLUMN_INDEX = 4;

export function filterPopulatedRows(grid: SheetGrid): SheetGrid {
    return grid.filter((row, index) => {
        if (index === 0) return true; // always keep the header row
        // Truthiness, not just null/undefined — matches the original, which
        // also dropped a cell holding 0 or false.
        const cell = row?.[REQUIRED_COLUMN_INDEX];
        return Boolean(cell) && String(cell).trim() !== '';
    });
}

export function toRowObjects(grid: SheetGrid): SheetRow[] {
    if (!grid || grid.length < 1 || !grid[0]) return [];

    const headers = grid[0] as string[];
    return grid.slice(1).map((row) => {
        const object: SheetRow = {};
        headers.forEach((header, index) => {
            const value = row?.[index];
            object[columnKey(header, index)] =
                value !== undefined && value !== null ? value : '';
        });
        return object;
    });
}
