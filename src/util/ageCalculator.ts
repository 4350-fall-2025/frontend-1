/**
 * ChatGPT asisted with the implementation of this Age Calculator
 * ---
 * Utility function to calculate age in years and months
 * from a given birthdate (ISO string or Date).
 *
 * Example output: "5y 3m", "7m", "0m"
 */

export default function calculateAge(dob: string | Date): string {
    //   const birth = new Date(dob);
    const now = new Date();

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    // optional rounding for small ages
    if (years === 0 && months === 0) return "0m";
    if (years === 0) return `${months}m`;
    if (months === 0) return `${years}y`;

    return `${years}y ${months}m`;
}
