"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconArrowsSort } from "@tabler/icons-react";
import { noteTypeOptions } from "src/data/diary/constants";
import styles from "./page.module.scss";

/**
 * CREDITS
 *
 * Used Claude AI (Anthropic) and ChatGPT-5 to assist with:
 * - Styling SCSS module classes with proper structure
 * - Restructuring component to match project patterns
 * - Ensuring Next.js "use client" directive patterns are followed
 */

export default function PetDiaryDashboard() {
    const router = useRouter();

    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Newest first");

    const filters = [
        "All",
        ...noteTypeOptions.map((option) =>
            option.label === "Measurement" ? "Weight" : option.label,
        ),
    ];

    const handleQuickAdd = (noteType: string) => {
        // Navigate to new entry page with pre-selected note type
        router.push(`/owner/diary/create?noteType=${noteType}`);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pet Diary</h1>
                    <button
                        className={styles.newEntryBtn}
                        onClick={() => router.push("/owner/diary/create")}
                    >
                        <IconPlus size={16} />
                        New Entry
                    </button>
                </div>

                {/* Content Wrapper - Entries + Sidebar */}
                <div className={styles.contentWrapper}>
                    {/* Filters and Sort */}
                    <div className={styles.controls}>
                        <div className={styles.filters}>
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`${styles.filterBtn} ${
                                        activeFilter === filter
                                            ? styles.filterBtnActive
                                            : ""
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className={styles.sortContainer}>
                            <span className={styles.sortLabel}>Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option> Newest first </option>
                                <option> Oldest first </option>
                                <option> Pet name </option>
                            </select>
                            <IconArrowsSort
                                size={16}
                                className={styles.sortIcon}
                            />
                        </div>
                    </div>

                    {/* Diary Entries Placeholder */}
                    <div className={styles.entriesContainer}>
                        <div className={styles.placeholder}>
                            Diary entries will appear here
                        </div>
                    </div>

                    <aside className={styles.diarySidebar}>
                        <h2 className={styles.sidebarTitle}> Quick Add</h2>
                        <div className={styles.quickAddButtons}>
                            <button
                                className={styles.quickAddBtn}
                                onClick={() => handleQuickAdd("Measurement")}
                            >
                                Add Weight entry
                            </button>

                            <button
                                className={styles.quickAddBtn}
                                onClick={() => handleQuickAdd("Diet")}
                            >
                                Add Diet entry
                            </button>

                            <button
                                className={styles.quickAddBtn}
                                onClick={() => handleQuickAdd("Behaviour")}
                            >
                                Add Behaviour entry
                            </button>

                            <button
                                className={styles.quickAddBtn}
                                onClick={() => handleQuickAdd("General")}
                            >
                                Add General entry
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
