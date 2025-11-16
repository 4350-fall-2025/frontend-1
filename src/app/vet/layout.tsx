import React from "react";
import Sidebar from "~components/sidebar/sidebar";
import { vetNavLinks } from "~components/sidebar/sidebar-config";
import styles from "../layout.module.scss";

export default function VetLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.layout}>
            <Sidebar navLinks={vetNavLinks} />
            <main className={styles.content}>{children}</main>
        </div>
    );
}
