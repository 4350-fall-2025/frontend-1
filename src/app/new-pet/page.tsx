"use client";

import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { sexOptions, animalGroupOptions } from "~data/constants";
import { basicOptions } from "~data/constants";
import { defaultDate } from "~data/constants";
import {
    validateImage,
    validateDateValue,
    validateSelectedAnimalGroup,
    validateSelectedSex,
    validateSelectedSpayedOrNeutered,
} from "~util/validation/newPet";
import { urlToFile } from "~util/fileHandling.ts";
import { validateStringValue } from "~util/validation/validation.ts";
import styles from "./page.module.scss";
import placeholderImage from "../../../public/placeholder.jpg"; // https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=
import { useFileDialog } from "@mantine/hooks";

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

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            petImage: placeholderFile,
            animalGroup: "",
            species: "",
            breedOrVariety: "",
            birthDate: defaultDate,
            adoptionDate: defaultDate,
            sex: "",
            spayedOrNeutered: "",
        },

        validate: {
            petImage: validateImage,
            name: validateStringValue,
            sex: validateSelectedSex,
            spayedOrNeutered: validateSelectedSpayedOrNeutered,
            animalGroup: validateSelectedAnimalGroup,
            species: validateStringValue,
            breedOrVariety: validateStringValue,
            birthDate: validateDateValue,
            adoptionDate: validateDateValue,
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

    return (
        <div className={styles.page}>
            <main>
                <h1>Add a New Pet</h1>
                <form onSubmit={form.onSubmit(console.log)}>
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
                                            Reset
                                        </Button>
                                        <Button
                                            onClick={fileDialog.open}
                                            variant='filled'
                                            className={styles.button}
                                        >
                                            Pick files
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

                            <Select
                                data={sexOptions}
                                {...form.getInputProps("sex")}
                                key={form.key("sex")}
                                label='Sex'
                                placeholder='Please make a selection'
                                required
                            />
                        </div>
                        <div className={styles.right_content}>
                            <Select
                                data={basicOptions}
                                {...form.getInputProps("spayedOrNeutered")}
                                key={form.key("spayedOrNeutered")}
                                label='Spayed/Neutered'
                                placeholder='Please make a selection'
                                required
                            />

                            <Select
                                data={animalGroupOptions}
                                {...form.getInputProps("animalGroup")}
                                key={form.key("animalGroup")}
                                label='Animal Group'
                                placeholder='Please make a selection'
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
                                key={form.key("breedOrVariety")}
                                {...form.getInputProps("breedOrVariety")}
                            />

                            <DatePickerInput
                                label='Date of Birth'
                                required
                                key={form.key("birthDate")}
                                {...form.getInputProps("birthDate")}
                            ></DatePickerInput>

                            <DatePickerInput
                                label='Date of Adoption'
                                required
                                key={form.key("adoptionDate")}
                                {...form.getInputProps("adoptionDate")}
                            ></DatePickerInput>
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
                </form>
            </main>
        </div>
    );
}
