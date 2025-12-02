"use client";
import { Badge, Box, Button, Card, SimpleGrid } from "@mantine/core";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { useEffect, useState } from "react";
import { ImageCheckbox } from "~components/imageCheckbox/imageCheckbox";
import { useRouter } from "next/navigation";
import { Pet } from "src/models/pet";
import { Owner } from "src/models/owner";
import { getAuthenticatedOwner } from "~util/auth/getAuthenticatedUser";
import { PetsAPI } from "~api/petsAPI";
import { generatePetURL, getImageURL } from "src/firebase";
import { Client } from "@stomp/stompjs";
import placeholderImage from "~public/placeholder.jpg";
import {
    generateWebSocketUrl,
    websocketOwnerTopics,
} from "~data/messages/constants";
import { hasRole } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";

export default function Messages() {
    const [numVets, setNumVets] = useState(0);
    const [error, setError] = useState("");

    const [showConnectWithVetCard, setConnectWithVetCard] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const router = useRouter();

    const [pets, setPets] = useState<Pet[]>([]);
    const [imageUrls, setImageUrls] = useState({});

    const [owner, setOwner] = useState<Owner | null>(null);

    const [websocket, setWebsocket] = useState<Client>(null);

    useEffect(() => {
        let owner: Owner = getAuthenticatedOwner();
        setOwner(owner);

        if (!websocket) {
            const connection = new Client({
                brokerURL: generateWebSocketUrl(owner.id),
                onConnect: () => {
                    console.log("connected :D ");
                    connection.subscribe(
                        websocketOwnerTopics.onlineInit,
                        (msg) => {
                            const vetsArray = JSON.parse(msg.body);
                            console.log(vetsArray);
                            setNumVets(vetsArray.length);
                        },
                    );
                    setWebsocket(connection);
                },
            });

            connection.onStompError = function (frame) {
                console.log(
                    "Broker reported error: " + frame.headers["message"],
                );
                console.log("Additional details: " + frame.body);
            };

            connection.activate();
        }
    }, []);

    useEffect(() => {
        if (hasRole(UserRoles.owner)) {
            if (websocket != null) {
                websocket.subscribe(
                    websocketOwnerTopics.availableVets,
                    (msg) => {
                        console.log(msg);
                    },
                );
            }
        }
    }, [websocket]);

    // Load pets when owner is available
    useEffect(() => {
        const fetchPets = async () => {
            if (owner?.id) {
                try {
                    const fetchedPets = await PetsAPI.getAllPets(owner.id);
                    setPets(fetchedPets);

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

    const handlePetSelect = (petId: string) => {
        if (selectedPetId === petId) {
            // Deselect if clicking the same pet
            setSelectedPetId(null);
        } else {
            // Select the new pet
            setSelectedPetId(petId);
        }
    };

    const items = pets.map((pet) => (
        <ImageCheckbox
            disabled={selectedPetId !== null && selectedPetId !== pet.id}
            checked={selectedPetId === pet.id}
            onChange={() => handlePetSelect(pet.id)}
            description={pet.animalGroup.replaceAll("_", " ")}
            title={pet.name}
            image={imageUrls[pet.id]}
            key={pet.id}
        />
    ));

    return (
        <div className={styles.page}>
            <h1>Messages</h1>
            <p>Need help? Our vets are here to help.</p>

            <div className={styles.page_content}>
                <Card padding='sm'>
                    {/* Select a pet card content */}
                    {!showConnectWithVetCard && (
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h2>Select a Pet</h2>
                            </div>

                            <p>
                                Tell us which pet you are chatting about so the
                                vet can review their history.
                            </p>
                            <SimpleGrid
                                spacing='md'
                                cols={{ base: 1, sm: 1, md: 2 }}
                            >
                                {items}
                            </SimpleGrid>

                            <Box mt='xl'>
                                <Button
                                    className={globalStyles.rose_button}
                                    disabled={selectedPetId === null}
                                    onClick={() => setConnectWithVetCard(true)}
                                >
                                    Next
                                </Button>
                            </Box>
                        </div>
                    )}

                    {/* Connect with a vet card content */}
                    {showConnectWithVetCard && (
                        <div className={styles.card}>
                            <div className={styles.card_title}>
                                <h2>Connect with a Vet</h2>
                                <Badge variant='light' color='green'>
                                    {numVets <= 1 && numVets + " vet online"}
                                    {numVets > 1 && numVets + " vets online"}
                                </Badge>
                            </div>

                            <p>
                                Start a conversation with a QDOG vet about your
                                selected pet!
                            </p>

                            <div
                                className={
                                    globalStyles.cancel_or_save +
                                    " " +
                                    globalStyles.center
                                }
                            >
                                <Button
                                    onClick={() => setConnectWithVetCard(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        router.push("/owner/messages/chat")
                                    }
                                    disabled={numVets <= 0}
                                >
                                    Connect
                                </Button>
                            </div>
                            {numVets <= 0 && (
                                <p>Can't connect yet, no vets are online.</p>
                            )}
                        </div>
                    )}
                </Card>
                {error && <p className={globalStyles.error_message}>{error}</p>}
            </div>
        </div>
    );
}
