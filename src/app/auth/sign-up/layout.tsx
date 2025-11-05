import React from "react";
import styles from "./layout.module.scss";

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <main>{children}</main>
        </div>
    );
}
