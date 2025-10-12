"use client";

import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";

import { validateName, validatePasswordSignup } from "~util/validation/signup";
import PasswordRequirements from "~components/signup/passwordRequirements";

import styles from "./page.module.scss";

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

    form.watch("password", ({ value }) => {
        setPassword(value);
    });

    return (
        <>
            <h1>Sign Up to Track Your Pet's Needs!</h1>
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
