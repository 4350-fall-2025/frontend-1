"use client";

import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PasswordRequirements from "~components/signup/passwordRequirements";
import {
    validateName,
    validatePasswordSignup,
} from "~util/validation/validate-signup";

import styles from "./page.module.scss";
import { OwnersAPI } from "src/api/owners-api";
import { Owner } from "src/models/owner-obj";

export default function OwnerSignup() {
    const [_password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        validate: {
            firstName: validateName,
            lastName: validateName,
            email: isEmail("Invalid email format"),
            password: validatePasswordSignup,
        },
    });
    const router = useRouter();

    form.watch("password", ({ value }) => {
        setPassword(value);
    });

    const signUp = async (owner: Owner) => {
        try {
            await OwnersAPI.ownerSignUp(owner);
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
            <h1>Sign Up to Track Your Pet's Needs!</h1>

            <form
                noValidate
                onSubmit={form.onSubmit((values) => {
                    const owner = new Owner(values);
                    signUp(owner);
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
                    <PasswordRequirements password={_password} />
                </div>
                <Group>
                    <Button type='submit'>I'm ready!</Button>
                </Group>
            </form>
            {error != "" && <h3 className={styles.red_text}>{error}</h3>}
        </>
    );
}
