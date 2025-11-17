"use client";
import styles from "./page.module.scss";
import { Owner } from "src/models/owner";
import { useEffect, useState } from "react";
import { getAuthCookie, hasRole } from "~util/authCookies";
import { UserRoles } from "~data/constants";

export default function OwnerDashboard() {
    const [owner, setOwner] = useState<Owner>(null);

    useEffect(() => {
        const authUser = getAuthCookie();
        if (authUser && hasRole(UserRoles.owner)) {
            const ownerData = new Owner({
                id: authUser.userId,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                email: authUser.email,
            });
            setOwner(ownerData);
        }
    }, []);

    return (
        <div className={styles.page}>
            <h1>Hi {owner?.firstName}!</h1>
            <p>Welcome to the pet owner dashboard.</p>
        </div>
    );
}
