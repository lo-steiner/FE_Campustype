import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './Leaderboard.module.css';
import { hydrateRoot } from "react-dom/client";
import Link from "next/link";
import LeaderboardPlaceholder from "./LeaderboardPlaceholders.jsx";

const STORAGE_KEY = 'session';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [width, setWidth] = useState(0);
    const [selectedWords, setSelectedWords] = useState(10);

    const getUsername = () => {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const sessionData = JSON.parse(storedData);
                return sessionData.username;
            }
        return null;
    };

    const handleLeaderboardChange = async (words) => {
        try {
            const response = await LeaderboardAPI.getUsers(words);
            setUsers(response);
            setSelectedWords(words);
        } catch (error) {
            console.error("Failed to load leaderboard");
        }
    };

    useEffect(() => {
        handleLeaderboardChange(10);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.containerLeaderboard}>
            <div className={styles.filterContainer}>
                <div className={styles.mainFilter}>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === null ? styles.activeFilter : ''}`}
                       onClick={() => handleLeaderboardChange(null)}>All time</p>
                </div>
                <div className={styles.dayFilter}>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === null ? styles.activeFilter : ''}`}
                       onClick={() => handleLeaderboardChange(null)}>Daily</p>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === null ? styles.activeFilter : ''}`}
                       onClick={() => handleLeaderboardChange(null)}>Weekly</p>
                </div>
                <div className={styles.subFilter}>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === 10 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange(10)}>Words 10</p>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === 15 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange(15)}>Words 15</p>
                    <p className={`${styles.leaderboardFilter} ${selectedWords === 20 ? styles.activeFilter : ''}`}
                        onClick={() => handleLeaderboardChange(20)}>Words 20</p>
                </div>
            </div>
            <div className={styles.leaderboardContainer}>
                <h1 className={styles.leaderboardTitle}>LEADERBOARD</h1>
                {users.length > 0 ? (
                    <ul className={styles.leaderboardList}>
                        {users.map((user, i) => {
                            const username = getUsername();
                            const timestamp = user.timestamp;
                            const date = new Date(timestamp);
                            const formattedDate = date.toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            });

                            return (
                                <li key={user.id} className={username === user.user.username ? styles.currentUser : styles.rangElement}>
                                    <Link href={`/profile/${user.user.id}`}>
                                        <h2 className={styles.rangTitle}>
                                            {i + 1} {user.user.username}
                                        </h2>
                                    </Link>
                                    <Link href={`/run/${user.id}`}>
                                        <h3 className={styles.rangStat}>WPM: {user.wpm}</h3>
                                    </Link>
                                    {width > 700 && (
                                        <Link href={`/run/${user.id}`}>
                                            <h3 className={styles.rangStat}>Accuracy: {user.accuracy}%</h3>
                                        </Link>
                                    )}
                                    {width > 950 && (
                                        <Link href={`/run/${user.id}`}>
                                            <h3 className={styles.rangStat}>{formattedDate}</h3>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <ul className={styles.leaderboardList}>

                    </ul>
                )}
            </div>
        </div>
    );
}