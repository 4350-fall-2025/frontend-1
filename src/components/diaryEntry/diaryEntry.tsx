"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { toSentenceCase } from "~util/strings/normalize";
import { PetDiary } from "src/models/pet-diary";
import styles from "./diaryEntry.module.scss";

//TO-DO: pass in name as a parameter as well
export default function DiaryEntry({
    entry,
    name,
}: {
    entry: PetDiary;
    name?: String;
}) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/under-construction`);
    };

    return (
        <div className={styles.entry_card} onClick={handleClick}>
            <div>
                <h3 className={styles.heading}>{name ? name : ""}</h3>
            </div>
            <div className={styles.entry_header}>
                <h3 className={styles.heading}>
                    {name ? name : ""}
                    {toSentenceCase(entry.contentType)}
                </h3>
                <span>
                    {dayjs(entry.createTimestamp).format("MMMM D, YYYY")}
                </span>
            </div>
            <p className={styles.entry_body}>{entry.contentBody}</p>
        </div>
    );
}
