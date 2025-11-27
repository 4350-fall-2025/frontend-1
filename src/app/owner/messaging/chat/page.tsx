"use client";

//import { useEffect, useState } from "react";
import styles from "./page.module.scss";
export default function Messaging() {
    return (
        <div className={styles.page}>
            <div className={styles.chat}>
                <div className={styles.chat_header}>
                    <h1 className={styles.chat_header_name}>Dr. Doctor</h1>
                    <span className={styles.chat_subheader}>
                        Chat about pet name
                    </span>
                </div>
                <div className={styles.chat_body}>
                    <span className={styles.chat_subheader}>
                        You started a chat about name :D
                    </span>

                    <div className={styles.message_other}>wowowwow</div>
                    <div className={styles.message_me}>wowowwow</div>
                    <div className={styles.message_me}>
                        A lack of economic opportunity among black men, and the
                        shame and frustration that came from not being able to
                        provide for one's family, contributed to the erosion of
                        black families - a problem that welfare policies for
                        many years may have worsened. Anger over welfare and
                        affirmative action helped forge the Reagan Coalition.
                        But what the people heard instead - people of every
                        creed and color, from every walk of life - is that in
                        America, our destiny is inextricably linked.
                    </div>
                    <div className={styles.message_other}>
                        And in time, I came to see faith as more than just a
                        comfort to the weary or a hedge against death, but
                        rather as an active, palpable agent in the world and in
                        my own life. And because she had to miss days of work,
                        she was let go and lost her health care. If you have
                        health care, my plan will lower your premiums. The first
                        issue that we have to confront is violent extremism in
                        all of its forms.
                    </div>
                </div>
            </div>
            <div className={styles.pet_profile}></div>
        </div>
    );
}
