"use client";

import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";

import {
    validateName,
    validatePassword,
} from "~/util/validation/validate-signup";
import styles from "./page.module.scss";

function PasswordRequirement({
    meets,
    label,
}: {
    meets: boolean;
    label: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                color: meets ? "teal" : "red",
                marginTop: 7,
            }}
        >
            {meets ? (
                <CheckIcon width={14} height={14} />
            ) : (
                <Cross1Icon width={14} height={14} />
            )}
            <Text ml={10} size='sm'>
                {label}
            </Text>
        </div>
    );
}

export default function PatientSignup() {
    const [_password, setPassword] = useState<string>("");
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
        },
        validate: {
            firstName: validateName,
            lastName: validateName,
            email: isEmail("Invalid email format"),
            password: validatePassword,
        },
    });

    /**
     * Example requirement subcomponent found in Mantine docs:
     * https://mantine.dev/core/password-input/#strength-meter-example
     */
    const requirements = [
        { re: /.{8,}/, label: "At least 8 characters" },
        { re: /[0-9]/, label: "Includes number" },
        { re: /[a-z]/, label: "Includes lowercase letter" },
        { re: /[A-Z]/, label: "Includes uppercase letter" },
        {
            re: /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/,
            label: "Includes special symbol",
        },
    ];

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement
            key={index}
            label={requirement.label}
            meets={requirement.re.test(form.getValues().password)}
        />
    ));

    return (
        <div className={styles.page}>
            <main>
                <h1>Sign Up to Track Your Pet's Needs!</h1>
                <form onSubmit={form.onSubmit(() => {})}>
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
                    <div className={styles.password_fields}>
                        <PasswordInput
                            {...form.getInputProps("password")}
                            key={form.key("password")}
                            label='Password'
                            required
                            onChange={(event) =>
                                setPassword(event.currentTarget.value)
                            }
                        />
                        <div>
                            {requirements.map((requirement, index) => (
                                <PasswordRequirement
                                    key={index}
                                    label={requirement.label}
                                    meets={requirement.re.test(_password)}
                                />
                            ))}
                        </div>
                    </div>
                    <Group>
                        <Button type='submit'>I'm ready!</Button>
                    </Group>
                </form>
            </main>
        </div>
    );
}
