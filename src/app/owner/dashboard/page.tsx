"use client";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { Owner } from "src/models/owner";
import { useEffect, useState } from "react";
import { getAuthenticatedOwner } from "~util/auth/getAuthenticatedUser";

export default function OwnerDashboard() {
    const [owner, setOwner] = useState<Owner>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        try {
            const authenticatedOwner: Owner = getAuthenticatedOwner();
            setOwner(authenticatedOwner);
        } catch (error) {
            setError(error);
        }
    }, []);

    return (
        <div className={styles.page}>
            {owner && (
                <>
                    <h1>Hi {owner.firstName}!</h1>
                    <p>Welcome to the pet owner dashboard.</p>
                </>
            )}
            {error && <p className={globalStyles.error_message}>{error}</p>}
        </div>
    );
}
