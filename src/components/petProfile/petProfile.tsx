"use client";

import { Image } from "@mantine/core";
import dayjs from "dayjs";
import DiaryEntry from "~components/diaryEntry/diaryEntry";
import {
    formatAgeFromDOB,
    formatAnimalGroup,
    formatSterileStatus,
} from "~util/strings/format-pet";
import { useEffect, useState } from "react";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { Pet } from "src/models/pet";
import { PetDiary } from "src/models/pet-diary";
import Error from "~components/error/error";
import { generatePetURL, getImageURL } from "src/firebase";
import { getAuthCookie } from "~util/auth/authCookies";
import { toSentenceCase } from "~util/strings/normalize";
import styles from "./petProfile.module.scss";

interface PetProfileProps {
    id: string;
}

export default function PetProfile({ id }: PetProfileProps) {
    const placeholderUrl = "/placeholder.jpg";

    const [error, setError] = useState<string>(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [diaryEntries, setDiaryEntries] = useState<PetDiary[]>([]);

    const [imageUrl, setImageUrl] = useState<string>(placeholderUrl); //default should be placeholder image

    const getPetData = async () => {
        try {
            const response = await PetsAPI.getPet(id);
            getPetImage();
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

    const getPetImage = async () => {
        try {
            const authUser = getAuthCookie();
            if (authUser?.userId != null) {
                const filePath = generatePetURL(authUser.userId, id);
                const url = await getImageURL(filePath);
                setImageUrl(url);
            } else {
                setError("Not signed In");
            }
        } catch (error) {
            //TO-DO maybe for a specific error
            setImageUrl(placeholderUrl);
        }
    };

    useEffect(() => {
        getPetData();
        getPetDiaryData();
    }, []);

    if (error) {
        return <Error />;
    }

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
