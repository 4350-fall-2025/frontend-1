"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import calculateAge from "src/util/ageCalculator";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import placeholderImage from "~public/placeholder.jpg";
import { Image } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { getAnimalGroupDisplayLabel } from "src/util/strings/format-pet";
import { PetsAPI } from "~api/petsAPI";
import { Owner } from "src/models/owner";
import { Pet } from "src/models/pet";
import { generatePetURL, getImageURL } from "src/firebase";

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

    const [error, setError] = useState("");
    const [owner, setOwner] = useState<Owner>(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const storedOwner = new Owner(JSON.parse(storedUser));

            setOwner(storedOwner);
        }
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);
    const [imageUrls, setImageUrls] = useState({}); //dictionary

    // TODO: Make a util function for fetching pets and return the pets? to reduce duplicate code
    // localStorage code above might benefit from this too but we are switching to firestore so not needed

    useEffect(() => {
        const fetchPets = async () => {
            if (owner?.id) {
                try {
                    const fetchedPets: Pet[] = await PetsAPI.getAllPets(
                        owner.id,
                    );
                    setPets(fetchedPets);
                    console.log(fetchedPets);

                    const promises = [];
                    const images = {};

                    for (let pet of fetchedPets) {
                        promises.push(getPetImage(owner.id, pet, images));
                    }
                    await Promise.all(promises);

                    setPets(fetchedPets);
                    setImageUrls(images);
                } catch (error) {
                    setError(
                        "We can't retrieve all your pets. Please try again later.",
                    );
                }
            }
        };

        fetchPets();
    }, [owner]);

    const getPetImage = async (ownerId, pet: Pet, imageDict) => {
        try {
            const filePath = generatePetURL(ownerId, pet.id);
            const url = await getImageURL(filePath);
            imageDict[pet.id] = url;
        } catch (error) {
            imageDict[pet.id] = placeholderImage.src;
        }
    };

    return (
        <div className={styles.page}>
            <main>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Pets</h1>
                    <button
                        className={styles.add_button}
                        onClick={() => router.push("/owner/pets/create")}
                    >
                        <IconPlus size={16} />
                        Add a new pet
                    </button>
                </div>

                {/* PET CARD GRID */}
                {pets && pets.length <= 0 && (
                    <p>No pets found. Add yours now!</p>
                )}
                {pets && pets.length > 0 && (
                    <div className={styles.pet_grid}>
                        {pets.map((pet) => (
                            <div key={pet.id} className={styles.pet_card}>
                                <div className={styles.pet_image}>
                                    <Image
                                        src={imageUrls[pet.id]}
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
                                                router.push(
                                                    "/under-construction",
                                                )
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
                                        value={getAnimalGroupDisplayLabel(
                                            pet.animalGroup,
                                        )}
                                    />
                                    <InfoRow
                                        label='Species'
                                        value={pet.species}
                                    />
                                    <InfoRow
                                        label='Breed/Variety'
                                        value={pet.breed}
                                    />

                                    <button
                                        className={styles.view_details_button}
                                        onClick={() =>
                                            router.push(`/owner/pets/${pet.id}`)
                                        }
                                        type='button'
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <p className={globalStyles.error_message}>{error}</p>
            </main>
        </div>
    );
}
