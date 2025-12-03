export const defaultDate: Date = new Date(0);

export const todayDate: Date = new Date();

export const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export enum UserRoles {
    owner = "owner",
    vet = "vet",
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
