"use client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { Vet } from "src/models/Vet";

export default function VetDashboard() {
    const [vet, setVet] = useState<Vet>(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const storedOwner = new Vet(JSON.parse(storedUser));

            setVet(storedOwner);
        }
    }, []);

    return (
        <div className={styles.page}>
            <h1>
                Hi Dr.{vet != null && `${vet?.firstName} ${vet?.lastName}`}!
            </h1>
            <p>Welcome to the veterinary dashboard.</p>
        </div>
    );
}
