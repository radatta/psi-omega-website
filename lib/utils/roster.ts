import * as brothersData from '@/lib/brothers_data';

export interface PledgeMember {
    name: string;
    major: string;
    year: string;
}

// Pledge classes are discovered from the module's exports rather than listed
// here, so adding a class to brothers_data.ts is enough — nothing to register.
const isPledgeClass = (value: unknown): value is PledgeMember[] =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
        (member) =>
            member &&
            typeof member.name === 'string' &&
            typeof member.major === 'string' &&
            typeof member.year === 'string'
    );

export const pledgeClasses: PledgeMember[][] =
    Object.values(brothersData).filter(isPledgeClass);

// Deduplicated by name: exec and committee members also appear in their class.
export const activeBrothers: PledgeMember[] = Object.values(
    Object.fromEntries(
        pledgeClasses.flat().map((member) => [member.name, member])
    )
);

export const totalMembers = activeBrothers.length;

// Distinct major *strings*, which is not the same as distinct fields of study:
// several roster entries are combined majors ('Finance & Computer Science'),
// and some of those are single named SCU programmes ('Accounting & Information
// Systems') rather than two majors. Splitting on '&' would therefore be wrong.
// Today this is 24; the page labels it MAJORS.
export const totalMajors = new Set(activeBrothers.map((member) => member.major))
    .size;
