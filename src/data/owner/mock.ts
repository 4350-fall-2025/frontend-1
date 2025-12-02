import { Owner } from "src/models/owner";
import { UserRoles } from "~data/constants";
import { AuthCookieData } from "~util/auth/authCookies";

export const mockAuthOwner: AuthCookieData = {
    userId: "123",
    role: UserRoles.owner,
    firstName: "Test",
    lastName: "Owner",
    email: "test@example.com",
};

export const mockOwner: Owner = {
    firstName: "Test",
    lastName: "Owner",
    email: "test@example.com",
    password: "mockPassword",
    id: "123",
    token: "mockToken",
};
