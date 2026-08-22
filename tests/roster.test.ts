import { describe, expect, test } from 'bun:test';
import { readdirSync } from 'fs';
import { join } from 'path';
import {
    activeBrothers,
    pledgeClasses,
    totalMajors,
    totalMembers,
} from '@/lib/utils/roster';

const PHOTO_DIR = join(import.meta.dir, '..', 'public', 'images', 'brothers');

describe('roster derivation', () => {
    test('finds every pledge class', () => {
        // Guard against the discovery silently matching nothing.
        expect(pledgeClasses.length).toBeGreaterThanOrEqual(3);
        for (const pledgeClass of pledgeClasses) {
            expect(pledgeClass.length).toBeGreaterThan(0);
        }
    });

    test('activeBrothers has no duplicate names', () => {
        const names = activeBrothers.map((brother) => brother.name);
        expect(new Set(names).size).toBe(names.length);
    });

    test('totalMembers counts every distinct brother', () => {
        const names = new Set(
            pledgeClasses.flat().map((brother) => brother.name)
        );
        expect(totalMembers).toBe(names.size);
        expect(totalMembers).toBeGreaterThanOrEqual(40);
    });

    test('totalMembers matches the photos on disk', () => {
        // The stat is shown to the public, so tie it to something real rather
        // than only to the data file it is derived from.
        const photos = readdirSync(PHOTO_DIR).filter((file) =>
            file.endsWith('.jpg')
        );
        expect(totalMembers).toBe(photos.length);
    });

    test('totalMajors is plausible', () => {
        expect(totalMajors).toBeGreaterThan(0);
        expect(totalMajors).toBeLessThanOrEqual(totalMembers);
    });
});
