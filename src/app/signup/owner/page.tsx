"use client";

import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PasswordRequirements from "~components/signup/passwordRequirements";
import { validateName, validatePasswordSignup } from "~util/validation/signup";

import styles from "./page.module.scss";
import { OwnersAPI } from "src/api/OwnersAPI";
import { Owner } from "src/models/Owner";

export default function PatientSignup() {
    const [_password, setPassword] = useState<string>("");
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

    return (
        <>
            <h1>Sign Up to Track Your Pet's Needs!</h1>
            <form
                onSubmit={form.onSubmit((values) => {
                    const owner = new Owner(values);
                    OwnersAPI.ownerSignUp(owner);
                    router.push("/");
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
        </>
    );
}
