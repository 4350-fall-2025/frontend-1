"use client"; // doesn't use server

import {
    Tabs,
    TabsList,
    TabsTab,
    TextInput,
    PasswordInput,
    Button,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { VetsAPI } from "~api/vetsAPI";
import { OwnersAPI } from "~api/ownersAPI";
import { validatePassword } from "~util/validation/validate-signin";
import ownerImage from "~public/login/petOwner.jpg"; // source: https://unsplash.com/photos/woman-hugging-a-dog-FtuJIuBbUhI
import vetImage from "~public/login/vet.jpg"; // source: https://www.freepik.com/free-photo/close-up-doctor-checking-cat-s-belly_23442502.htm#fromView=keyword&page=1&position=32&uuid=d7e73635-ac35-41b6-80b1-b544a20a5f68&query=Vet

import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";

import { signInWithBackendToken } from "src/firebase";
import { setAuthCookie } from "~util/auth/authCookies";
import { UserRoles } from "~data/constants";

export default function LoginPage() {
    const owner: string = "owner";
    const vet: string = "vet";

    const form = useForm({
        mode: "uncontrolled",
        initialValues: { email: "", password: "" },

        validate: {
            email: isEmail("Invalid email format"),
            password: validatePassword,
        },
    });

    // sets selected tab/user to be owner by default
    const [selectedUser, setSelectedUser] = useState(owner);
    const [errorMessage, setErrorMessage] = useState(null);

    const emailPlaceholder: string = "youremail@email.com";

    const backdropImage: StaticImageData =
        selectedUser == owner ? ownerImage : vetImage;
    const backdropImageAltText: string =
        selectedUser == owner ? "Dog with the pet owner" : "Cat with vets";

    const buttonColor: string =
        selectedUser == owner ? styles.button_owner : styles.button_vet;

    const router = useRouter();

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            if (selectedUser === vet) {
                const vet = await VetsAPI.vetLogin(values);
                setAuthCookie({
                    userId: vet.id,
                    role: UserRoles.vet,
                    firstName: vet.firstName,
                    lastName: vet.lastName,
                    email: vet.email,
                });
                router.push("/vet/dashboard");
            } else {
                const owner = await OwnersAPI.ownerLogin(values);
                setAuthCookie({
                    userId: owner.id,
                    role: UserRoles.owner,
                    firstName: owner.firstName,
                    lastName: owner.lastName,
                    email: owner.email,
                });
                signInWithBackendToken(owner.token);
                router.push("/owner/pets/dashboard");
            }
        } catch (error) {
            setErrorMessage("Invalid Login. Please try again.");
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <div className={styles.login_section}>
                        <h1> Welcome to QDog!</h1>

                        <Tabs value={selectedUser} onChange={setSelectedUser}>
                            <TabsList>
                                <TabsTab value={owner}>Pet Owner</TabsTab>
                                <TabsTab value={vet}>Veterinarian</TabsTab>
                            </TabsList>
                        </Tabs>

                        <form
                            className={`${styles.tabs_panel} ${selectedUser}`}
                            onSubmit={form.onSubmit(handleLogin)}
                        >
                            <TextInput
                                label='Email'
                                placeholder={emailPlaceholder}
                                key={form.key("email")}
                                {...form.getInputProps("email")}
                            />

                            <PasswordInput
                                label='Password'
                                key={form.key("password")}
                                {...form.getInputProps("password")}
                            />

                            <Button
                                type='submit'
                                className={buttonColor}
                                variant='filled'
                            >
                                Login
                            </Button>
                        </form>

                        <div className={styles.login_footer}>
                            {errorMessage != null && (
                                <p className={globalStyles.error_message}>
                                    {errorMessage}
                                </p>
                            )}
                            <a href='/under-construction?hideNav=true'>
                                Forgot password
                            </a>
                            <p>
                                Don't have an account yet?{" "}
                                <Link href={`/auth/sign-up/${selectedUser}`}>
                                    Sign up!
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className={styles.image_grid}>
                        <Image
                            alt={backdropImageAltText}
                            src={backdropImage}
                        ></Image>
                    </div>
                </div>
            </main>
        </div>
    );
}
