"use client";
import { useEffect, useState } from "react";
import { Vet } from "src/models/vet";
import { UserRoles } from "~data/constants";
import { getAuthCookie, hasRole } from "~util/authCookies";

export default function VetDashboard() {
    const [vet, setVet] = useState<Vet>(null);

    useEffect(() => {
        const authUser = getAuthCookie();
        if (authUser && hasRole(UserRoles.vet)) {
            const vetData = new Vet({
                id: authUser.userId,
                firstName: authUser.firstName,
                lastName: authUser.lastName,
                email: authUser.email,
            });
            setVet(vetData);
        }
    }, []);

    return (
        <div>
            <h1>
                Hi Dr. {vet != null && `${vet?.firstName} ${vet?.lastName}`}!
            </h1>
            <p>Welcome to the veterinary dashboard.</p>
        </div>
    );
}
