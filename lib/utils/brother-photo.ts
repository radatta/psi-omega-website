// Brother photos are name-derived: 'Jane Doe' -> /images/brothers/Jane-Doe.jpg
// BrotherCard and the data-integrity tests must agree on this rule, so it
// lives here rather than being spelled out in both.
export const brotherPhotoPath = (name: string) =>
    `/images/brothers/${name.split(' ').join('-')}.jpg`;
