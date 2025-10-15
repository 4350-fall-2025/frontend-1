"use client";
import styles from "./page.module.scss";
import { Owner } from "src/models/owner";
import { useEffect, useState } from "react";
export default function OwnerDashboard() {
    const [owner, setOwner] = useState<Owner>(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const storedOwner = new Owner(JSON.parse(storedUser));

            setOwner(storedOwner);
        }
    }, []);

    return (
        <div className={styles.page}>
            <h1>Hi {owner?.firstName}!</h1>
            <p>Welcome to the pet owner dashboard.</p>
        </div>
    );
}
