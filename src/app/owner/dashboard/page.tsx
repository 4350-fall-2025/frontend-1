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
            const storedOwner = new Owner(JSON.parse(storedUser));

            setOwner(storedOwner);
        }
    }, []);

    return (
//         <div className={styles.page}>
//             <h1>Hi {owner?.firstName}!</h1>
//             <p>Welcome to the pet owner dashboard.</p>
//
//             <PetDashboard hideTitle={true}/>
//         </div>

        <div className={styles.dashboard_container}>
            <header className={styles.welcome_header}>
                <h1 className={styles.welcome_title}>
                    Welcome back, {owner?.firstName}!
                </h1>
                <p>Welcome to the pet owner dashboard.</p>
            </header>

            <div className={styles.pet_dashboard_wrapper}>
                <PetDashboard hideTitle={true} />
            </div>
        </div>
    );
}
