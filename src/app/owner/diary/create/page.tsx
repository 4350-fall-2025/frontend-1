"use client";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { PetDiary } from "src/models/pet-diary";
import { useRouter } from "next/navigation";
import { validateOptionalImage } from "~util/validation/validation";
import { validateDiaryContentBody } from "~util/validation/validate-diary";
import { Button, Group, List, Select, Textarea } from "@mantine/core";
import { noteTypeOptions } from "~data/diary/constants";
import { useFileDialog } from "@mantine/hooks";
import { Pet } from "src/models/pet";
import { mockPets } from "~data/pets/mock";
import { Owner } from "src/models/owner";

/**
 * Some sample code came from Mantine use-file-dialog
 */

export default function NewDiary() {
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

    let pets: Pet[];
    try {
        pets = mockPets;

        // TODO: use this instead after the getAllPets is implemented in backend
        // pets = await PetsAPI.getAllPets(user.id);
    } catch (error) {
        setError(
            "You cannot make a diary entry for your pet without having any pet.",
        );
    }

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
            media: null,
        },

        validate: {
            pet: isNotEmpty("This pet field can't be empty."),
            contentType: isNotEmpty("This note type field can't be empty."),
            contentBody: validateDiaryContentBody,
            media: validateOptionalImage,
        },
    });

    const fileDialog = useFileDialog({
        accept: "image/*",
    });

    const pickedMedia = Array.from(fileDialog.files || []).map((file) => (
        <List.Item key={file.name}>{file.name}</List.Item>
    ));

    // clears file dialog and resets media contents
    const resetMedia = () => {
        fileDialog.reset();
        form.setFieldValue("media", null);
    };

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError("");

            if (owner?.id != null) {
                const diaryEntryJSON = {
                    ...values,
                    media: Array.from(fileDialog.files),
                };

                const diaryEntry = new PetDiary(diaryEntryJSON);

                // TODO: uncomment after the getAllPets is implemented in backend
                // await PetDiaryAPI.createDiary(owner.id, values.pet.id, diaryEntry);

                router.push("/owner/dashboard"); // TODO: change to diary once created
            } else {
                setError(
                    "You cannot make a diary entry for your pet without being logged in.",
                );
            }
        } catch (error) {
            console.error("Error in handleSubmit: ", error);
            setError("You cannot make a diary entry."); // TODO: Add a more specific error depending on backend's implementation
        }
    };

    const handleCancel = () => {
        router.push("/owner/dashboard"); // TODO: change to diary once created
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
                            placeholder='Add your contentBody here'
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
                                <Button variant='default' onClick={resetMedia}>
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
                            {pickedMedia.length > 0 && (
                                <List mt='sm' size='sm'>
                                    {pickedMedia}
                                </List>
                            )}
                        </div>

                        <div className={globalStyles.save_or_cancel}>
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

                        <p className={globalStyles.error_message}>{error}</p>
                    </div>
                </form>
            </main>
        </div>
    );
}
