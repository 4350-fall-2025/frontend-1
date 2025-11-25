import { UserRoles } from "~data/constants";
import { AuthCookieData } from "~util/auth/authCookies";

export const mockAuthVet: AuthCookieData = {
    userId: "456",
    role: UserRoles.vet,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
};
