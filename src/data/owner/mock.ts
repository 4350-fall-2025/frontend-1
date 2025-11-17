import { UserRoles } from "~data/constants";
import { AuthCookieData } from "~util/authCookies";

export const mockAuthOwner: AuthCookieData = {
    userId: "123",
    role: UserRoles.owner,
    firstName: "Test",
    lastName: "Owner",
    email: "test@example.com",
};
