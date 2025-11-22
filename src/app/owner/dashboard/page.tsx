"use client";

import styles from "./page.module.scss";
import { Owner } from "src/models/owner";
import { useEffect, useState } from "react";
import PetDashboard from "src/app/owner/pets/dashboard/page";

export default function OwnerDashboard() {
    const [owner, setOwner] = useState<Owner>(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            try {
                const owner = new Owner(JSON.parse(storedUser));
                setOwner(owner);
            }
            catch (error) {
                // Handle invalid JSON gracefully
                console.error("Failed to parse user data:", error);
                setOwner(null);
            }
        }
    }, []);

    return (
        <div className={styles.dashboard_container} data-testid="dashboard-container">
            <header className={styles.welcome_header} data-testid="welcome-header">
                <h1 className={styles.welcome_title}>
                    Welcome back, {owner?.firstName || ""}!
                </h1>
                <p>Welcome to the pet owner dashboard.</p>
            </header>

            <div className={styles.pet_dashboard_wrapper} data-testid="pet-dashboard-wrapper">
                <PetDashboard hideTitle={true} />
            </div>
        </div>
    );
}
