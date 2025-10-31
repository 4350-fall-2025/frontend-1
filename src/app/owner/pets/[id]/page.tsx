"use client";

import { Button } from "@mantine/core";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Pet } from "src/models/pet";
import { PetsAPI } from "~api/petsAPI";
import { toSentenceCase } from "~util/strings/normalize";
import Error from "./error";
import styles from "./page.module.scss";
import {
    formatAgeFromDOB,
    formatAnimalGroup,
    formatSterileStatus,
} from "~util/strings/format-pet";

export default function PetProfilePage() {
    const [error, setError] = useState(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const { id } = useParams<{ id: string }>();

    const getPetData = async () => {
        try {
            const response = await PetsAPI.getPet(id);
            setPet(response);
        } catch (error) {
            setError(error);
            return;
        }
    };

    useEffect(() => {
        getPetData();
    }, []);

    if (error) {
        return <Error />;
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
                <Image
                    className={styles.pet_image}
                    src='/placeholder.jpg'
                    width={200}
                    height={200}
                    alt='Pet profile picture'
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
                    <p>No entries yet.</p>
                </div>
                <div className={styles.pet_notes_column}>
                    <h2>Vet Notes</h2>
                    <p>No notes to show.</p>
                </div>
            </div>
        </div>
    );
}
