"use client";

import { Box, Button, Group, Select, Switch, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { todayDate, basicOptions } from "~data/constants";
import { animalGroupOptions, sexOptions } from "~data/pets/constants";
import { validateImage } from "~util/validation/validate-new-pet";
import { urlToFile } from "~util/file-handling";
import {
    validateOptionalDateValue,
    validateRequiredDateValue,
    validateRequiredStringValue,
} from "~util/validation/validation.ts";
import styles from "./page.module.scss";
import placeholderImage from "~public/placeholder.jpg"; // https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=
import { useFileDialog } from "@mantine/hooks";
import { PetsAPI } from "src/api/petsAPI";
import { Pet, SterileStatus } from "src/models/pet";
import { useRouter } from "next/navigation";

/**
 * CREDITS
 *
 * Used the following resources to handle image input through file dialog
 * https://mantine.dev/hooks/use-file-dialog/
 * https://legacy.reactjs.org/docs/hooks-effect.html
 * https://developer.mozilla.org/en-US/docs/Web/API/URL
 * Google AI Mode
 * ChatGPT 4.1 (for turning placeholder image URL into a File and its comments)
 */

export default function NewPet() {
    const [placeholderFile, setPlaceholderFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string>(placeholderImage.src);
    const router = useRouter();

    const [error, setError] = useState("");

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            petImage: placeholderFile,
            animalGroup: "",
            species: "",
            breed: "",
            birthdate: todayDate,
            sex: "",
            spayedOrNeutered: "",
        },

        validate: {
            petImage: validateImage,
            name: validateRequiredStringValue,
            sex: isNotEmpty("This sex field can't be empty."),
            spayedOrNeutered: isNotEmpty(
                "This spayed/neutered field can't be empty.",
            ),
            animalGroup: isNotEmpty("This animal group field can't be empty."),
            species: validateRequiredStringValue,
            breed: validateRequiredStringValue,
            birthdate: validateRequiredDateValue,
        },
    });

    const fileDialog = useFileDialog({
        multiple: false,
    });

    const setImageToPlaceholderFile = () => {
        setPreviewUrl(placeholderImage.src);

        if (placeholderFile) {
            form.setFieldValue("petImage", placeholderFile);
        }
    };

    // clears file dialog and resets image preview and form value to placeholder
    const resetImage = () => {
        fileDialog.reset();
        setImageToPlaceholderFile();
    };

    // so petFile is initialized to the placeholder image, not a null value
    useEffect(() => {
        async function setInitialPlaceholderFile() {
            const file = await urlToFile(
                placeholderImage.src,
                "placeholder.jpg",
                "image/jpeg",
            );
            setPlaceholderFile(file);
            form.setFieldValue("petImage", file);
        }
        setInitialPlaceholderFile();
    }, []);

    useEffect(() => {
        // If a new file is selected, create a new object URL and store the image in the form
        if (fileDialog.files && fileDialog.files.length > 0) {
            const petFile: File = fileDialog.files[0];
            const newUrl = URL.createObjectURL(petFile);

            setPreviewUrl(newUrl);
            form.setFieldValue("petImage", petFile);
        } else {
            setImageToPlaceholderFile();
        }

        // Revoke the URL when component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [fileDialog.files]);

    const [estimatedBirthDate, setEstimatedBirthDate] = useState(false);

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError("");
            const user = JSON.parse(localStorage.getItem("currentUser"));

            if (user?.id != null) {
                let sterileStatus: SterileStatus;
                if (values.spayedOrNeutered == "Yes") {
                    sterileStatus = SterileStatus.sterile;
                } else if (values.spayedOrNeutered == "No") {
                    sterileStatus = SterileStatus.nonsterile;
                } else {
                    sterileStatus = SterileStatus.unknown;
                }

                const petJSON = {
                    ...values,
                    sterileStatus: sterileStatus,
                    estimatedBirthdate: estimatedBirthDate,
                };
                const pet = new Pet(petJSON);
                await PetsAPI.createPet(user.id, pet);
                router.push("/owner/dashboard");
            } else {
                setError("You cannot make a pet without being logged in.");
            }
        } catch (error) {
            setError("You cannot make a pet without being logged in.");
        }
    };

    return (
        <div className={styles.page}>
            <main>
                <h1>Add a New Pet</h1>
                <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
                    <div className={styles.form_content}>
                        <div className={styles.left_content}>
                            <div className={styles.image_section}>
                                <Box className={styles.image_box}>
                                    <img
                                        src={previewUrl}
                                        alt='New pet image'
                                        className={styles.pet_image}
                                    ></img>
                                </Box>

                                <div>
                                    <Group>
                                        <Button
                                            variant='default'
                                            onClick={resetImage}
                                        >
                                            Reset image
                                        </Button>
                                        <Button
                                            onClick={fileDialog.open}
                                            variant='filled'
                                            className={styles.button}
                                        >
                                            Pick image
                                        </Button>
                                    </Group>
                                </div>
                            </div>

                            <TextInput
                                label="Pet's name"
                                required
                                key={form.key("name")}
                                {...form.getInputProps("name")}
                            />
                        </div>
                        <div className={styles.right_content}>
                            <Select
                                data={sexOptions}
                                {...form.getInputProps("sex")}
                                key={form.key("sex")}
                                label='Sex'
                                placeholder='Please select a sex'
                                required
                            />

                            <Select
                                data={basicOptions}
                                {...form.getInputProps("spayedOrNeutered")}
                                key={form.key("spayedOrNeutered")}
                                label='Spayed/Neutered'
                                placeholder='Please select an option for spayed/neutered'
                                required
                            />

                            <Select
                                data={animalGroupOptions}
                                {...form.getInputProps("animalGroup")}
                                key={form.key("animalGroup")}
                                label='Animal Group'
                                placeholder='Please select an animal group'
                                required
                            />

                            <TextInput
                                label='Species'
                                required
                                key={form.key("species")}
                                {...form.getInputProps("species")}
                            />

                            <TextInput
                                label='Breed or Variety'
                                required
                                key={form.key("breed")}
                                {...form.getInputProps("breed")}
                            />
                            <div className={styles.birthdate}>
                                <DatePickerInput
                                    label='Date of Birth'
                                    required
                                    key={form.key("birthdate")}
                                    error={form.errors.birthdate}
                                    clearable={true}
                                    {...form.getInputProps("birthdate")}
                                ></DatePickerInput>
                                <Switch
                                    checked={estimatedBirthDate}
                                    onChange={(event) =>
                                        setEstimatedBirthDate(
                                            event.currentTarget.checked,
                                        )
                                    }
                                    className={styles.estimated}
                                    label='Estimated'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottom_content}>
                        <Button variant='default'>Cancel</Button>
                        <Button
                            variant='filled'
                            className={styles.button}
                            type='submit'
                        >
                            Save
                        </Button>
                    </div>
                    <p className={styles.error_message}>{error}</p>
                </form>
            </main>
        </div>
    );
}
