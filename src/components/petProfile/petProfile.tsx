"use client";

import { Image } from "@mantine/core";
import dayjs from "dayjs";
import DiaryEntry from "~components/diaryEntry/diaryEntry";
import {
    formatAgeFromDOB,
    formatAnimalGroup,
    formatSterileStatus,
} from "~util/strings/format-pet";
import { toSentenceCase } from "~util/strings/normalize";
import { Pet } from "src/models/pet";
import { PetDiary } from "src/models/pet-diary";
import styles from "./petProfile.module.scss";

interface PetProfileProps {
    pet: Pet;
    diaryEntries: PetDiary[];
    imageUrl: string;
}

export default function PetProfile({
    pet,
    diaryEntries,
    imageUrl,
}: PetProfileProps) {
    return (
        <div className={styles.component}>
            <div className={styles.component_content}>
                <h1 className={styles.header}>{pet?.name}</h1>
                <div className={styles.pet_info}>
                    <div className={styles.pet_image_container}>
                        <Image
                            className={styles.pet_image}
                            src={imageUrl}
                            alt='Pet profile picture'
                        />
                    </div>
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
