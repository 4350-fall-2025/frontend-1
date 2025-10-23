import React from "react";
import Sidebar from "~components/sidebar";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />
            <main>{children}</main>
        </>
    );
}
