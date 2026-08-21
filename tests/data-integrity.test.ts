// Data-integrity tests: the repo's real failure mode is data/asset drift,
// not logic bugs. These assert that every path our data files reference
// actually exists on disk, and vice versa.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'bun:test';

import * as brothersData from '@/lib/brothers_data';
import { companies } from '@/lib/legacy_data';
import { memoriesPhotosPaths } from '@/lib/memories_data';
import { brotherPhotoPath } from '@/lib/utils/brother-photo';

const BROTHERS_DIR = 'public/images/brothers';

type Member = { name: string };
type PledgeMember = Member & { major: string; year: string };

const isRoster = (v: unknown): v is Member[] =>
    Array.isArray(v) && v.every((m) => typeof m?.name === 'string');

// Pledge classes are the rosters whose members carry a grad year; exec and
// committee chairs do not. Deriving them from the module namespace means a
// new class added to brothers_data.ts is covered without touching this file.
const isPledgeClass = (v: unknown): v is PledgeMember[] =>
    isRoster(v) && v.length > 0 && v.every((m) => 'year' in m);

// Widened to unknown so the narrowing predicates below are assignable —
// the exported rosters have heterogeneous member shapes.
const exports_ = Object.entries(brothersData) as [string, unknown][];

const pledgeClasses = exports_.filter((e): e is [string, PledgeMember[]] =>
    isPledgeClass(e[1])
);

const allRosters = exports_.filter((e): e is [string, Member[]] =>
    isRoster(e[1])
);

// committeeChairs stores two people per entry as 'First Last + First Last'.
const splitNames = (name: string) => name.split('+').map((n) => n.trim());

// Deduped: brothers appear in both a pledge class and an exec/chair role.
const allRosterNames = [
    ...new Set(
        allRosters.flatMap(([, members]) =>
            members.flatMap((m) => splitNames(m.name))
        )
    ),
];

const onDisk = (publicPath: string) =>
    existsSync(join('public', publicPath.replace(/^\//, '')));

describe('roster discovery', () => {
    test('finds every roster and pledge class in brothers_data', () => {
        // Guards the namespace filters above: if these silently matched
        // nothing, every photo test below would pass vacuously.
        expect(allRosters.length).toBeGreaterThanOrEqual(8);
        expect(pledgeClasses.length).toBeGreaterThanOrEqual(6);
        expect(allRosterNames.length).toBeGreaterThanOrEqual(90);
    });
});

describe('brother photos', () => {
    test('every roster name has a photo on disk', () => {
        const missing = allRosterNames.filter(
            (name) => !onDisk(brotherPhotoPath(name))
        );
        expect(missing).toEqual([]);
    });

    test('every photo on disk belongs to someone on the roster', () => {
        const expected = new Set(
            allRosterNames.map((n) => brotherPhotoPath(n).split('/').pop())
        );
        const orphans = readdirSync(BROTHERS_DIR)
            .filter((f) => f.endsWith('.jpg'))
            .filter((f) => !expected.has(f));
        expect(orphans).toEqual([]);
    });
});

describe('roster data', () => {
    test('no brother appears in two pledge classes', () => {
        const names = pledgeClasses.flatMap(([, members]) =>
            members.map((m) => m.name)
        );
        const dupes = [
            ...new Set(names.filter((n, i) => names.indexOf(n) !== i)),
        ];
        expect(dupes).toEqual([]);
    });

    test.each(pledgeClasses)('%s has no duplicate names', (_name, members) => {
        const names = members.map((m) => m.name);
        const dupes = names.filter((n, i) => names.indexOf(n) !== i);
        expect(dupes).toEqual([]);
    });

    test.each(pledgeClasses)(
        '%s has a 4-digit grad year for everyone',
        (_name, members) => {
            const bad = members
                .filter((m) => !/^\d{4}$/.test(m.year))
                .map((m) => m.name);
            expect(bad).toEqual([]);
        }
    );
});

describe('company logos', () => {
    test('every logo in legacy_data exists', () => {
        const missing = companies
            .filter((c) => !existsSync(join('public/images/companies', c.logo)))
            .map((c) => c.logo);
        expect(missing).toEqual([]);
    });
});

describe('memories', () => {
    test('every memory src exists', () => {
        const missing = memoriesPhotosPaths
            .map((m) => m.src)
            .filter((src) => !onDisk(src));
        expect(missing).toEqual([]);
    });
});

// Catch-all: any '/images/...' literal anywhere in source must resolve.
// This covers the inline event galleries in app/events/page.tsx and every
// hero image, which no data file exports.
describe('image literals in source', () => {
    const sourceFiles = (dir: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
            const p = join(dir, e.name);
            if (e.isDirectory()) return sourceFiles(p);
            return /\.tsx?$/.test(e.name) ? [p] : [];
        });

    const files = ['app', 'components', 'lib'].flatMap(sourceFiles);

    test('scans a plausible number of source files', () => {
        expect(files.length).toBeGreaterThan(20);
    });

    test('every referenced image path exists in public/', () => {
        const missing: string[] = [];
        let found = 0;
        for (const file of files) {
            const matches =
                readFileSync(file, 'utf8').match(
                    /['"`](\/images\/[^'"`${}]+)['"`]/g
                ) ?? [];
            for (const m of matches) {
                found++;
                const path = m.slice(1, -1);
                if (!onDisk(path)) missing.push(`${file}: ${path}`);
            }
        }
        expect(missing).toEqual([]);
        expect(found).toBeGreaterThan(100);
    });
});
