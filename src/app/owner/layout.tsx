import React from "react";
import Sidebar from "~components/sidebar/sidebar";
import { ownerNavLinks } from "~components/sidebar/sidebar-config";
import styles from "../layout.module.scss";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <Sidebar navLinks={ownerNavLinks}/>
            <main className={styles.content}>{children}</main>
        </div>
    );
}
