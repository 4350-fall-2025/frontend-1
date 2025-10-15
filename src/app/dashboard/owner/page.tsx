import styles from "./page.module.scss";

export default function OwnerDashboard() {
    const ownerName: string = "John Doe"; // TODO: replace with actual owner name from backend

    return (
        <div className={styles.page}>
            <h1>Hi {ownerName}!</h1>
            <p>Welcome to the pet owner dashboard.</p>
        </div>
    );
}
