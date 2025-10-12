/**
 * Province list and validation functions generated with GPT-5 mini
 */

"use client";

import { Button, Group, PasswordInput, Select, TextInput } from "@mantine/core";
import {
    isEmail,
    isInRange,
    isNotEmpty,
    matches,
    useForm,
} from "@mantine/form";
import { useState } from "react";

import PasswordRequirements from "~components/signup/passwordRequirements";
import { validateName, validatePasswordSignup } from "~util/validation/signup";

import styles from "./page.module.scss";

const provinces = [
    { value: "AB", label: "AB" },
    { value: "BC", label: "BC" },
    { value: "MB", label: "MB" },
    { value: "NB", label: "NB" },
    { value: "NL", label: "NL" },
    { value: "NS", label: "NS" },
    { value: "NT", label: "NT" },
    { value: "NU", label: "NU" },
    { value: "ON", label: "ON" },
    { value: "PE", label: "PE" },
    { value: "QC", label: "QC" },
    { value: "SK", label: "SK" },
    { value: "YT", label: "YT" },
];

export default function VetSignup() {
    const [_password, setPassword] = useState<string>("");
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            firstName: "",
            lastName: "",
            province: "",
            licenseId: "",
            email: "",
            password: "",
        },
        validate: {
            firstName: validateName,
            lastName: validateName,
            province: isNotEmpty("Please select a province"),
            licenseId: (value) => {
                isNotEmpty("License ID is required");

                const trimmed = value.trim();
                matches(
                    /^[A-Za-z0-9]+$/,
                    "License ID may only contain letters and numbers",
                );
                isInRange(
                    { min: 5, max: 20 },
                    "License ID must be between 5 and 20 characters",
                );
                return "";
            },
            email: isEmail("Invalid email format"),
            password: validatePasswordSignup,
        },
    });

    form.watch("password", ({ value }) => {
        setPassword(value);
    });

    return (
        <>
            <h1>Sign Up to Start Treating Patients!</h1>
            <form
                onSubmit={() => {
                    console.log(form.getValues());
                    alert("Form submitted!");
                }}
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
                        {...form.getInputProps("licenseId")}
                        key={form.key("licenseId")}
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
                    <PasswordRequirements password={_password} />
                </div>
                <Group>
                    <Button type='submit'>I'm ready!</Button>
                </Group>
            </form>
        </>
    );
}
