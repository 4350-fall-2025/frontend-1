"use client";

import { Button } from "@mantine/core";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Pet } from "src/models/pet";
import { PetsAPI } from "~api/petsAPI";
import Error from "./error";
import styles from "./page.module.scss";
import dayjs from "dayjs";
import { toSentenceCase } from "~util/strings/normalize";
import {
    formatAgeFromDOB,
    formatAnimalGroup,
    formatSterileStatus,
} from "~util/strings/format-pet";

export default function PetProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [error, setError] = useState(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const { id } = use(params);

    const getOwnerId = (): string => {
        const currentUser = JSON.parse(
            localStorage.getItem("currentUser") || "{}",
        );
        return currentUser?.id || "";
    };

    const getPetData = async (ownerId) => {
        try {
            const response = await PetsAPI.getPet(ownerId, id);
            setPet(response);
        } catch (error) {
            setError(error);
            return;
        }
    };

    useEffect(() => {
        const ownerId = getOwnerId();
        getPetData(ownerId);
    }, []);

    if (error) {
        return <Error error={error} />;
    }

    // TODO: back button must direct to /owner/pets/ once page is done
    // TODO: insert pet image when available
    return (
        <div className={styles.page}>
            <div className={styles.top_bar}>
                <Button
                    component={Link}
                    href='/owner/dashboard'
                    variant='transparent'
                    color='red'
                    className={styles.back_button}
                >
                    <ArrowLeftIcon className={styles.back_icon} />
                    Back to My Pets
                </Button>
            </div>
            <h1 className={styles.header}>{pet?.name}</h1>
            <div className={styles.pet_info}>
                <div
                    className={styles.pet_image}
                    aria-label='Pet image placeholder'
                />
                <div className={styles.pet_details_column}>
                    <ul>
                        <li>
                            <span className={styles.pet_info_label}>Sex:</span>{" "}
                            {pet?.sex && toSentenceCase(pet?.sex)}
                        </li>
                        <li>
                            <span className={styles.pet_info_label}>
                                Animal group:
                            </span>{" "}
                            {pet?.animalGroup &&
                                formatAnimalGroup(pet?.animalGroup)}
                        </li>
                        <li>
                            <span className={styles.pet_info_label}>
                                Species:
                            </span>{" "}
                            {pet?.species && toSentenceCase(pet?.species)}
                        </li>
                        <li>
                            <span className={styles.pet_info_label}>
                                Breed:
                            </span>{" "}
                            {pet?.breed && toSentenceCase(pet?.breed)}
                        </li>
                    </ul>
                </div>
                <div className={styles.pet_details_column}>
                    <ul>
                        <li>
                            <span className={styles.pet_info_label}>Age: </span>
                            {pet?.birthdate && formatAgeFromDOB(pet?.birthdate)}
                        </li>
                        <li>
                            <span className={styles.pet_info_label}>
                                Spayed/Neutered:
                            </span>{" "}
                            {pet?.sterileStatus &&
                                formatSterileStatus(
                                    pet?.sterileStatus,
                                    pet?.sex,
                                )}
                        </li>
                        <li>
                            <span className={styles.pet_info_label}>
                                Birthdate:
                            </span>{" "}
                            {pet?.birthdate &&
                                dayjs(pet?.birthdate).format("MMMM D, YYYY")}
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.pet_notes}>
                <div className={styles.pet_notes_column}>
                    <h2>Diary Entries</h2>
                    <p>No notes to show.</p>
                </div>
                <div className={styles.pet_notes_column}>
                    <h2>Vet Notes</h2>
                    <p>No notes to show.</p>
                </div>
            </div>
        </div>
    );
}
