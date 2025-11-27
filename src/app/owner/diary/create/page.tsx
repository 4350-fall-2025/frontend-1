"use client";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState, useEffect, Suspense } from "react";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { PetDiary } from "src/models/pet-diary";
import { useRouter, useSearchParams } from "next/navigation";
import { validateOptionalImage } from "~util/validation/validation";
import { validateDiaryContentBody } from "~util/validation/validate-diary";
import { Button, Group, List, Select, Textarea } from "@mantine/core";
import { noteTypeOptions } from "~data/diary/constants";
import { getAuthenticatedOwner } from "~util/auth/getAuthenticatedUser";
import { useFileDialog } from "@mantine/hooks";
import { Pet } from "src/models/pet";
import { Owner } from "src/models/owner";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { todayDate, UserRoles } from "~data/constants";
import { generateDiaryURL, uploadFile, STORAGE_FLAG } from "src/firebase";

/**
 * Some sample code came from Mantine use-file-dialog
 */

function NewDiary() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");
    const [owner, setOwner] = useState<Owner | null>(null);
    const [isNoteTypePreselected, setIsNoteTypePreselected] = useState(false);
    const [pickedFilesList, setFilesList] = useState([]);

    useEffect(() => {
        try {
            const authenticatedOwner = getAuthenticatedOwner();
            setOwner(authenticatedOwner);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);

    // TODO: Make a util function for fetching pets and return the pets? to reduce duplicate code

    // Load pets when owner is available
    useEffect(() => {
        const fetchPets = async () => {
            if (owner?.id) {
                try {
                    const fetchedPets = await PetsAPI.getAllPets(owner.id);
                    setPets(fetchedPets);
                } catch (error) {
                    setError(
                        "We can't retrieve all your pets. Please try again later.",
                    );
                }
            }
        };

        fetchPets();
    }, [owner]); // Run when owner changes

    const petOptions: string[] = [];
    for (let pet of pets) {
        petOptions.push(pet?.name);
    }

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            pet: null,
            contentType: "",
            contentBody: "",
            files: null,
        },

        validate: {
            pet: isNotEmpty("This pet field can't be empty."),
            contentType: isNotEmpty("This note type field can't be empty."),
            contentBody: validateDiaryContentBody,
            files: validateOptionalImage,
        },
    });

    // Preselect note type from query param
    useEffect(() => {
        const noteTypeParam = searchParams.get("noteType");
        if (noteTypeParam) {
            // Find matching option by label (case-insensitive)
            const match = noteTypeOptions.find(
                (opt) =>
                    opt.label.toLowerCase() === noteTypeParam.toLowerCase(),
            );

            if (match) {
                // Set the form value to the ContentType enum value (e.g., "DIET")
                form.setFieldValue("contentType", match.value);
                setIsNoteTypePreselected(true); // Lock if note type is preselected
            }
        }
    }, [searchParams]);

    const fileDialog = useFileDialog({
        accept: "image/*",
        onChange(files) {
            if (files != null) {
                const filesArray = Array.from(files || []);
                const fullFileList = pickedFilesList.concat(filesArray);
                setFilesList(fullFileList);
            }
        },
    });

    // clears file dialog and resets files contents
    const resetFiles = () => {
        setFilesList([]);
        fileDialog.reset();
        form.setFieldValue("files", null);
    };

    const findPetIdByName = (petName: string): string | null => {
        const pet = pets.find((p) => p.name === petName);
        return pet?.id || null;
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError("");

            if (owner?.id != null) {
                const petId = findPetIdByName(values.pet);

                if (!petId) {
                    setError("Unable to find the selected pet.");
                    return;
                }

                const diaryEntryJSON = {
                    contentBody: values.contentBody,
                    contentType: values.contentType,
                    createTimestamp: todayDate,
                    files: pickedFilesList.map((file) => file.name),
                };

                if (!STORAGE_FLAG) {
                    diaryEntryJSON["files"] = [];
                }

                const diaryEntry = new PetDiary(diaryEntryJSON);

                const createdEntryID = (
                    await PetDiaryAPI.createDiary(petId, diaryEntry)
                ).id;

                //upload files to firebase - this method uploads all at the same time
                let promises = [];
                for (const file of pickedFilesList) {
                    let url = generateDiaryURL(
                        owner.id,
                        petId,
                        createdEntryID,
                        file.name,
                    );
                    promises.push(uploadFile(file, url));
                }
                await Promise.all(promises);
                router.push("/owner/diary/dashboard");
            } else {
                setError(
                    "You cannot make a diary entry for your pet without being logged in.",
                );
            }
        } catch (error) {
            console.error("Error in handleSubmit: ", error);
            setError(
                "Something went wrong with our server when creating diary. Please try again later.",
            );
        }
    };

    const handleCancel = () => {
        router.push("/owner/diary/dashboard");
    };

    return (
        <div className={styles.page}>
            <main>
                <h1>New Pet Diary Entry</h1>
                <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                    <div className={styles.form_content}>
                        <div className={styles.top_section}>
                            <Select
                                data={petOptions}
                                {...form.getInputProps("pet")}
                                key={form.key("pet")}
                                label='Pet'
                                placeholder='Select the pet that this entry is for'
                                required
                            />

                            <Select
                                data={noteTypeOptions}
                                {...form.getInputProps("contentType")}
                                key={form.key("contentType")}
                                label='Note Type'
                                placeholder='Select the type of this entry'
                                required
                            />
                        </div>

                        <Textarea
                            label='Notes'
                            placeholder='Add your notes here'
                            key={form.key("contentBody")}
                            {...form.getInputProps("contentBody")}
                            required
                            resize='vertical'
                        />

                        <div className={styles.select_media}>
                            <label>Upload Media</label>
                            <p>
                                Add 1 or more relevant images to this diary
                                entry.
                            </p>
                            <Group>
                                <Button variant='default' onClick={resetFiles}>
                                    Reset
                                </Button>
                                <Button
                                    onClick={fileDialog.open}
                                    variant='filled'
                                    color='green'
                                    className={styles.button}
                                >
                                    Upload
                                </Button>
                            </Group>
                            {pickedFilesList.length > 0 && (
                                <List mt='sm' size='sm'>
                                    {pickedFilesList.map((file, index) => (
                                        <List.Item key={index}>
                                            {file.name}
                                        </List.Item>
                                    ))}
                                </List>
                            )}
                        </div>

                        <div className={globalStyles.cancel_or_save}>
                            <Button variant='default' onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant='filled'
                                className={styles.button}
                                type='submit'
                            >
                                Save
                            </Button>
                        </div>

                        <p className={globalStyles.error_message_end}>
                            {error}
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default function NewDiaryPage() {
    return (
        <Suspense fallback={null}>
            <NewDiary />
        </Suspense>
    );
}
