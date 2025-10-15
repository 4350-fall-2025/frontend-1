/**
 * Custom validation functions partially generated with GPT-5 mini
 */

"use client";

import { Button, Group, PasswordInput, Select, TextInput } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PasswordRequirements from "~components/signup/passwordRequirements";
import { provinces } from "~data/constants";
import {
    validateLicenseId,
    validateName,
    validatePasswordSignup,
} from "~util/validation/validate-signup";

import styles from "./page.module.scss";
import { Vet } from "src/models/Vet";
import { VetsAPI } from "src/api/VetsAPI";

export default function VetSignup() {
    const [_validatedPassword, setValidatedPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            firstName: "",
            lastName: "",
            province: "",
            certification: "",
            email: "",
            password: "",
        },
        validate: {
            firstName: validateName,
            lastName: validateName,
            province: isNotEmpty("Please select a province"),
            certification: validateLicenseId,
            email: isEmail("Invalid email format"),
            password: validatePasswordSignup,
        },
    });
    const router = useRouter();

    form.watch("password", ({ value }) => {
        setValidatedPassword(value);
    });

    const signUp = async (vet: Vet) => {
        try {
            await VetsAPI.vetSignUp(vet);
            router.push("/");
        } catch (error) {
            console.log(error);
            setError(
                error?.response?.data?.detail?.email ||
                    "Signup failed. Please try again.",
            );
        }
    };

    return (
        <>
            <h1>Sign Up to Start Treating Patients!</h1>
            <form
                noValidate
                onSubmit={form.onSubmit((values) => {
                    const vet = new Vet(values);
                    signUp(vet);
                })}
            >
                <div className={styles.name_fields}>
                    <TextInput
                        {...form.getInputProps("firstName")}
                        key={form.key("firstName")}
                        label='First name'
                        required
                    />
                    <TextInput
                        {...form.getInputProps("lastName")}
                        key={form.key("lastName")}
                        label='Last name'
                        required
                    />
                </div>
                <div className={styles.id_fields}>
                    <Select
                        {...form.getInputProps("province")}
                        data={provinces}
                        key={form.key("province")}
                        label='Province'
                        placeholder='Select your province'
                        required
                    />
                    <TextInput
                        {...form.getInputProps("certification")}
                        key={form.key("certification")}
                        label='License ID'
                        required
                    />
                </div>
                <TextInput
                    {...form.getInputProps("email")}
                    key={form.key("email")}
                    label='Email'
                    required
                />
                <div className={styles.password_field}>
                    <PasswordInput
                        {...form.getInputProps("password")}
                        key={form.key("password")}
                        label='Password'
                        required
                    />
                    <PasswordRequirements password={_validatedPassword} />
                </div>
                <Group>
                    <Button type='submit'>I'm ready!</Button>
                </Group>
            </form>
            {error != "" && <h3 className={styles.red_text}>{error}</h3>}
        </>
    );
}
