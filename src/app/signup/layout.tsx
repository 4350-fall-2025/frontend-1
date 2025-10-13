import styles from "./layout.module.scss";

export default function SignupLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className={styles.layout}>
            <main>{children}</main>
        </div>
    );
}
