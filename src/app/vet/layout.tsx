import React from "react";
import Sidebar from "~components/sidebar";
import styles from "../layout.module.scss";

export default function VetLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.content}>{children}</main>
        </div>
    );
}
