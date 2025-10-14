import styles from "./page.module.scss";

export default function VetDashboard() {
    const vetName: string = "Dr. John Doe"; // TODO: replace with actual vet name from backend

    return (
        <div className={styles.page}>
            <h1>Hi {vetName}!</h1>
            <p>Welcome to the veterinary dashboard.</p>
        </div>
    );
}
