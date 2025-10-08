"use client" // doesn't use server

import Image from "next/image";
import styles from "./page.module.scss";
import { Tabs, TabsList, TabsTab, TextInput, PasswordInput, Button } from "@mantine/core";
import ownerImage from "../../public/login/petOwner.jpg" // source: https://unsplash.com/photos/woman-hugging-a-dog-FtuJIuBbUhI
import vetImage from "../../public/login/vet.jpg" // source: https://www.freepik.com/free-photo/close-up-doctor-checking-cat-s-belly_23442502.htm#fromView=keyword&page=1&position=32&uuid=d7e73635-ac35-41b6-80b1-b544a20a5f68&query=Vet
import { useState } from "react";

export default function Home() {
  const owner = "owner";
  const vet = "vet";

  // sets selected tab/user to be owner by default
  const [selectedUser, setSelectedUser] = useState(owner);

  const backdropImage = selectedUser == owner ? ownerImage : vetImage;
  const backdropImageAltText = selectedUser == owner ? "Dog with the pet owner" : "Cat with vets";

  const buttonColor = selectedUser == owner ? styles.button_owner : styles.button_vet;

  // TODO: extract from back end and add proper error validation
  let emailErrorMessage: string = "Incorrect email format.";
  let passwordErrorMessage: string = "Incorrect password.";

  let emailPlaceholder: string = "youremail@email.com";

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

            <div className={`${styles.tabs_panel} ${selectedUser}`}>
              <TextInput
                label="Email"
                placeholder={emailPlaceholder}
                error={emailErrorMessage}
              />

              <PasswordInput
                label="Password"
                error={passwordErrorMessage}
              />

              <Button className={buttonColor} variant="filled">Login</Button>

              <div className={styles.login_footer}>
                <a href="">Forgot password</a>
                <p>Don't have an account yet? <a href="">Sign up!</a></p>
              </div>
            </div>
          </div>

          <div className={styles.image_grid}>
            <Image src={backdropImage} alt={backdropImageAltText}></Image>
          </div>
        </div>
      </main >
    </div >
  );
}
