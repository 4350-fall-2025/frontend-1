"use client";

import { useState } from "react";
import { mockPets } from "~data/pets/constants";
import styles from "./page.module.scss";
import {
    Card,
    Image,
    Text,
    Button,
    Group,
    Stack,
    Badge,
    Box,
    Title,
} from "@mantine/core";

const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className={styles.info_row}>
            <span className={styles.info_label}>{label}: </span>
            <span className={styles.info_value}>{value}</span>
        </div>
    );
};

export default function PetDashboard() {
    return (
        <div className={styles.page}>
            <main>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Pets</h1>
                    <button className={styles.add_button}>
                        + Add a new pet
                    </button>
                </div>

                {/* PET CARD GRID */}
                <div className={styles.pet_grid}>
                    {mockPets.map((pet) => (
                        <div key={pet.id} className={styles.pet_card}>
                            <div className={styles.pet_image}>
                                <span className={styles.image_icon}>🖼</span>
                            </div>

                            <div className={styles.pet_content}>
                                <div className={styles.pet_header}>
                                    <h3 className={styles.pet_name}>
                                        {pet.name}
                                    </h3>
                                    <button className={styles.edit_badge}>
                                        EDIT
                                    </button>
                                </div>

                                <InfoRow label='Age' value={pet.age} />
                                <InfoRow label='Sex' value={pet.sex} />
                                <InfoRow
                                    label='Animal group'
                                    value={pet.group}
                                />
                                <InfoRow label='Species' value={pet.species} />
                                <InfoRow
                                    label='Breed/Variety'
                                    value={pet.breed}
                                />

                                <button className={styles.view_details_button}>
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
