"use client";

import { Button } from "@mantine/core";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import DiaryEntry from "~components/diaryEntry/diaryEntry";
import {
    formatAgeFromDOB,
    formatAnimalGroup,
    formatSterileStatus,
} from "~util/strings/format-pet";
import { toSentenceCase } from "~util/strings/normalize";
import { Pet } from "src/models/pet";
import { PetDiary } from "src/models/pet-diary";
import Error from "./error";
import styles from "./page.module.scss";

export default function PetProfilePage() {
    const [error, setError] = useState(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [diaryEntries, setDiaryEntries] = useState<PetDiary[]>([]);
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

    const getPetDiaryData = async () => {
        try {
            const response = await PetDiaryAPI.getDiaryEntries(id);
            setDiaryEntries(response);
        } catch (error) {
            setError(error);
            return;
        }
    };

    useEffect(() => {
        getPetData();
        getPetDiaryData();
    }, []);

    if (error) {
        return <Error />;
    }

    // TODO: insert pet image when available
    return (
        <div className={styles.page}>
            <div className={styles.top_bar}>
                <Button
                    component={Link}
                    href='/owner/pets/dashboard'
                    variant='transparent'
                    className={styles.back_button}
                >
                    <ArrowLeftIcon className={styles.back_icon} />
                    Back to My Pets
                </Button>
            </div>
            <div className={styles.page_content}>
                <h1 className={styles.header}>{pet?.name}</h1>
                <div className={styles.pet_info}>
                    <Image
                        className={styles.pet_image}
                        src='/placeholder.jpg'
                        width={200}
                        height={200}
                        alt='Pet profile picture'
                    />
                    <div className={styles.pet_details}>
                        <div className={styles.pet_details_column}>
                            <ul>
                                <li>
                                    <span className={styles.pet_info_label}>
                                        Sex:
                                    </span>{" "}
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
                                    {pet?.species &&
                                        toSentenceCase(pet?.species)}
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
                                    <span className={styles.pet_info_label}>
                                        Birthdate:
                                    </span>{" "}
                                    {pet?.birthdate &&
                                        dayjs(pet?.birthdate).format(
                                            "MMMM D, YYYY",
                                        )}
                                </li>
                                <li>
                                    <span className={styles.pet_info_label}>
                                        Age:{" "}
                                    </span>
                                    {pet?.birthdate &&
                                        formatAgeFromDOB(pet?.birthdate)}
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
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.pet_notes}>
                    <div className={styles.pet_notes_column}>
                        <h2>Diary Entries</h2>
                        <div className={styles.diary_entries_list}>
                            {diaryEntries.length > 0 ? (
                                diaryEntries.map((entry) => (
                                    <DiaryEntry
                                        key={entry.id + 1}
                                        entry={entry}
                                    />
                                ))
                            ) : (
                                <p>No entries yet.</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.pet_notes_column}>
                        <h2>Vet Notes</h2>
                        <p>No notes to show.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
