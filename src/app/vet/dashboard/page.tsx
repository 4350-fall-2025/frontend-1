"use client";
import globalStyles from "~app/layout.module.scss";
import { useEffect, useState } from "react";
import { Vet } from "src/models/vet";
import { getAuthenticatedVet } from "~util/auth/getAuthenticatedUser";

export default function VetDashboard() {
    const [vet, setVet] = useState<Vet>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const { vet: authenticatedVet, error: authError } =
            getAuthenticatedVet();

        if (authError) {
            setError(authError);
            return;
        }

        setVet(authenticatedVet);
    }, []);

    return (
        <div>
            {vet && (
                <>
                    <h1>
                        Hi Dr.{" "}
                        {vet != null && `${vet?.firstName} ${vet?.lastName}`}!
                    </h1>
                    <p>Welcome to the veterinary dashboard.</p>
                </>
            )}
            {error && <p className={globalStyles.error_message}>{error}</p>}
        </div>
    );
}
