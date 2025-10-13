"use client";

import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { sexOptions, animalGroupOptions } from "../../data/pet.ts";
import { basicOptions } from "../../data/general.ts";
import { defaultDate } from "../../data/date.ts";
import {
    validateStringValue,
    validateImage,
    validateDateValue,
    validateSelectedAnimalGroup,
    validateSelectedSex,
    validateSelectedSpayedOrNeutered,
} from "../../util/validation/validate-newpet.ts";
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
 */

export default function NewPet() {
    const petFile: File = null; // TODO make placeholder file?

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            petImage: petFile,
            animalGroup: "",
            species: "",
            breedOrVariety: "",
            birthDate: defaultDate,
            adoptionDate: defaultDate,
            sex: "",
            spayedOrNeutered: "",
        },

        validate: {
            name: validateStringValue, // TODO use validate name
            petImage: validateImage, // TODO move to validation gen
            animalGroup: validateSelectedAnimalGroup,
            species: validateStringValue, // TODO use validate name
            breedOrVariety: validateStringValue, // TODO use validate name
            birthDate: validateDateValue, // TODO move to validation gen
            adoptionDate: validateDateValue, // TODO move to validation gen
            sex: validateSelectedSex,
            spayedOrNeutered: validateSelectedSpayedOrNeutered,
        },
    });

    const fileDialog = useFileDialog({
        multiple: false,
    });

    const resetImage = () => {
        fileDialog.reset();
        setPreviewUrl(placeholderImage.src);
    };

    const [previewUrl, setPreviewUrl] = useState<string>(placeholderImage.src);

    useEffect(() => {
        // If a new file is selected, create a new object URL and store the image in the form
        if (fileDialog.files && fileDialog.files.length > 0) {
            const petFile: File = fileDialog.files[0];
            const newUrl = URL.createObjectURL(petFile);

            setPreviewUrl(newUrl);
            form.setFieldValue("petImage", petFile);
        } else {
            setPreviewUrl(placeholderImage.src);
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
