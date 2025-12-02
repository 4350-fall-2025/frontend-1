import { Vet } from "src/models/vet";
import { UserRoles } from "~data/constants";
import { AuthCookieData } from "~util/auth/authCookies";

export const mockAuthVet: AuthCookieData = {
    userId: "456",
    role: UserRoles.vet,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
};

export const mockVet: Vet = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    password: "",
    id: "456",
    certification: "cert",
    token: "mockTocken",
};
