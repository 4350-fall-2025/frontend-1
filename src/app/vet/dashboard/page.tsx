"use client";
import { useEffect, useState } from "react";
import { Vet } from "src/models/vet";

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
        <div>
            <h1>
                Hi Dr.{vet != null && `${vet?.firstName} ${vet?.lastName}`}!
            </h1>
            <p>Welcome to the veterinary dashboard.</p>
        </div>
    );
}
