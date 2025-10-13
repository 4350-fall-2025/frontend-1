"use client"; // doesn't use server

import Image, { StaticImageData } from "next/image";
import {
    Tabs,
    TabsList,
    TabsTab,
    TextInput,
    PasswordInput,
    Button,
} from "@mantine/core";
import { useState } from "react";
import { isEmail, useForm } from "@mantine/form";
import { validatePassword } from "../util/validation/validation.ts";
import styles from "./page.module.scss";
import ownerImage from "../../public/login/pet-owner.jpg"; // source: https://unsplash.com/photos/woman-hugging-a-dog-FtuJIuBbUhI
import vetImage from "../../public/login/vet.jpg"; // source: https://www.freepik.com/free-photo/close-up-doctor-checking-cat-s-belly_23442502.htm#fromView=keyword&page=1&position=32&uuid=d7e73635-ac35-41b6-80b1-b544a20a5f68&query=Vet
import Link from "next/link";

export default function Home() {
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

    const emailPlaceholder: string = "youremail@email.com";

    const backdropImage: StaticImageData =
        selectedUser == owner ? ownerImage : vetImage;
    const backdropImageAltText: string =
        selectedUser == owner ? "Dog with the pet owner" : "Cat with vets";

    const buttonColor: string =
        selectedUser == owner ? styles.button_owner : styles.button_vet;

    return (
        <div className={styles.page}>
            <main>
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
                            onSubmit={form.onSubmit(console.log)}
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
                            <a href=''>Forgot password</a>
                            <p>
                                Don't have an account yet?{" "}
                                <Link href={`/signup/${selectedUser}`}>
                                    Sign up!
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className={styles.image_grid}>
                        <Image
                            src={backdropImage}
                            alt={backdropImageAltText}
                        ></Image>
                    </div>
                </div>
            </main>
        </div>
    );
}
