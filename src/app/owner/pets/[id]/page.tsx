"use client";

import { Button } from "@mantine/core";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { Pet } from "src/models/pet";
import { PetDiary } from "src/models/pet-diary";
import Error from "~components/error/error";
import { generatePetURL, getImageURL } from "src/firebase";
import { getAuthCookie } from "~util/auth/authCookies";
import PetProfile from "~components/petProfile/petProfile";
import styles from "./page.module.scss";

export default function PetProfilePage() {
    const placeholderUrl = "/placeholder.jpg";

    const [error, setError] = useState(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [diaryEntries, setDiaryEntries] = useState<PetDiary[]>([]);
    const { id } = useParams<{ id: string }>();
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
            <PetProfile
                pet={pet}
                diaryEntries={diaryEntries}
                imageUrl={imageUrl}
            ></PetProfile>
        </div>
    );
}
