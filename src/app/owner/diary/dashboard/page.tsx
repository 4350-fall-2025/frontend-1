"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconArrowsSort } from "@tabler/icons-react";
import { noteTypeOptions } from "src/data/diary/constants";
import styles from "./page.module.scss";
import globalStyles from "~app/layout.module.scss";
import { Pet } from "src/models/pet";
import { Owner } from "src/models/owner";
import { PetsAPI } from "~api/petsAPI";
import { PetDiaryAPI } from "~api/petDiaryAPI";
import { PetDiary } from "src/models/pet-diary";
import DiaryEntry from "~components/diaryEntry/diaryEntry";

const INIT_FILTER = { value: "ALL", label: "All" };

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

    const [error, setError] = useState("");
    const [owner, setOwner] = useState<Owner>(null);

    useEffect(() => {
        let storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            const storedOwner = new Owner(JSON.parse(storedUser));

            setOwner(storedOwner);
        }
    }, []);

    const [pets, setPets] = useState<Pet[]>([]);

    // TODO: Make a util function for fetching pets and return the pets? to reduce duplicate code
    // localStorage code above might benefit from this too but we are switching to firestore so not needed

    useEffect(() => {
        const fetchPets = async () => {
            if (owner?.id) {
                try {
                    const fetchedPets = await PetsAPI.getAllPets(owner.id);
                    setPets(fetchedPets);
                } catch (error) {
                    setError(
                        "We can't retrieve all your pets. Please try again later.",
                    );
                }
            }
        };

        fetchPets();
    }, [owner]);

    // TODO: Make a util function for fetching diaries and return the diaries? to reduce duplicate code
    const [diaries, setDiaries] = useState<{ entry: PetDiary; pet: Pet }[]>([]);

    useEffect(() => {
        const fetchDiaries = async () => {
            if (owner?.id && pets.length > 0) {
                try {
                    const fetchedDiaries: { entry: PetDiary; pet: Pet }[] = [];
                    for (const pet of pets) {
                        const petDiaries = await PetDiaryAPI.getDiaryEntries(
                            pet.id,
                        );
                        let namedEntry = petDiaries.map((entry) => ({
                            entry: entry,
                            pet: pet,
                        }));
                        fetchedDiaries.push(...namedEntry); //idea:
                    }

                    setDiaries(fetchedDiaries);
                } catch (error) {
                    setError(
                        "We can't retrieve all your diary entries. Please try again later.",
                    );
                }
            }
        };

        fetchDiaries();
    }, [owner, pets]);

    //these should be higher but thats a later problem
    const [sortBy, setSortBy] = useState("Pet name");

    const filters = [INIT_FILTER, ...noteTypeOptions];
    const [activeFilter, setActiveFilter] = useState(INIT_FILTER);

    const filteredEntries =
        activeFilter.label == "All"
            ? diaries
            : diaries.filter(
                  (entry) => entry.entry.contentType == activeFilter.value,
              );

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
                                    key={filter.label}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`${styles.filterBtn} ${
                                        activeFilter === filter
                                            ? styles.filterBtnActive
                                            : ""
                                    }`}
                                >
                                    {filter.label}
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
                        {filteredEntries && filteredEntries.length <= 0 && (
                            <p>No diary entry yet</p>
                        )}

                        {filteredEntries.map((diary) => (
                            <DiaryEntry
                                key={diary.entry.id}
                                entry={diary.entry}
                                pet={diary.pet}
                            />
                        ))}

                        <p className={globalStyles.error_message}>{error}</p>
                    </div>

                    <aside className={styles.diarySidebar}>
                        <h2 className={styles.sidebarTitle}> Quick Add</h2>
                        <div className={styles.quickAddButtons}>
                            {noteTypeOptions
                                .filter((option) => option.label !== "Other")
                                .map((option) => {
                                    const displayLabel = option.label;
                                    return (
                                        <button
                                            key={option.value}
                                            className={styles.quickAddBtn}
                                            onClick={() =>
                                                handleQuickAdd(option.value)
                                            }
                                        >
                                            Add {displayLabel} entry
                                        </button>
                                    );
                                })}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
