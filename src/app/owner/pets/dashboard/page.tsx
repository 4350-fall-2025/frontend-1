"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockPets } from "../../../../data/pets/mock";
import calculateAge from "../../../../util/ageCalculator";
import styles from "./page.module.scss";
import placeholderImage from "~public/placeholder.jpg";
import { Card, Image, Text, Button } from "@mantine/core";
import Link from "next/link";

/**
 * CREDITS
 *
 * Used Claude AI (Anthropic) and ChatGPT-5 to assist with:
 * - Converting inline styles to SCSS module classes with proper structure
 * - Restructuring component to match project patterns (removing layout components,
 *   converting helpers to arrow functions, organizing className references)
 * - Ensuring Next.js "use client" directive patterns are followed
 */

const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className={styles.info_row}>
            <span className={styles.info_label}>{label}: </span>
            <span className={styles.info_value}>{value}</span>
        </div>
    );
};

export default function PetDashboard() {
    const router = useRouter();

    console.log("[PetDashboard render] loaded");
    console.log("mockPets is", mockPets);
    console.log("InfoRow is", InfoRow);

    return (
        <div className={styles.page}>
            <main>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Pets</h1>
                    <button
                        className={styles.add_button}
                        onClick={() => router.push("/owner/pets/create")}
                    >
                        + Add a new pet
                    </button>
                </div>

                {/* PET CARD GRID */}
                <div className={styles.pet_grid}>
                    {mockPets.map((pet) => (
                        <div key={pet.id} className={styles.pet_card}>
                            <div className={styles.pet_image}>
                                <Image
                                    src={pet.photoUrl || placeholderImage.src}
                                    alt={`${pet.name} photo`}
                                    className={styles.image_icon}
                                />
                            </div>

                            <div className={styles.pet_content}>
                                <div className={styles.pet_header}>
                                    <h3 className={styles.pet_name}>
                                        {pet.name}
                                    </h3>

                                    {/* TODO: Link to edit page when implemented */}
                                    <button
                                        className={styles.edit_badge}
                                        onClick={() =>
                                            router.push("/under-construction")
                                        }
                                        type='button'
                                    >
                                        Edit
                                    </button>
                                </div>

                                <InfoRow
                                    label='Age'
                                    value={calculateAge(pet.birthdate)}
                                />
                                <InfoRow label='Sex' value={pet.sex} />
                                <InfoRow
                                    label='Animal group'
                                    value={pet.animalGroup}
                                />
                                <InfoRow label='Species' value={pet.species} />
                                <InfoRow
                                    label='Breed/Variety'
                                    value={pet.breed}
                                />

                                {/* TODO: Link to pet details page when implemented */}
                                <button
                                    className={styles.view_details_button}
                                    onClick={() =>
                                        router.push("/under-construction")
                                    }
                                    type='button'
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
