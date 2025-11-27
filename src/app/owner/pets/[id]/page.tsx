"use client";

import { Button } from "@mantine/core";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import PetProfile from "~components/petProfile/petProfile";
import styles from "./page.module.scss";

export default function PetProfilePage() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className={styles.page}>
            <div className={styles.top_bar}>
                <Button
                    component={Link}
                    href='/owner/pets/dashboard'
                    variant='transparent'
                    className={styles.back_button}
                >
                    <ArrowLeftIcon className={styles.back_icon} />
                    Back to My Pets
                </Button>
            </div>
            <PetProfile id={id}></PetProfile>
        </div>
    );
}
