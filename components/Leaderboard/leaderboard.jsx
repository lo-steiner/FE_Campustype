import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './styles.module.css';

const STORAGE_KEY = 'session';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [width, setWidth] = useState(0);
    const [selectedWords, setSelectedWords] = useState(10); // Added to track current word count

    const getUsername = () => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const sessionData = JSON.parse(storedData);
                return sessionData.username;
            }
        }
        return null;
    };

    const handleLeaderboardChange = async (words) => {
        try {
            const response = await LeaderboardAPI.getUsers(words);
            setUsers(response);
            setSelectedWords(words);
        } catch (error) {
            console.error("Failed to load leaderboard: ", error);
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
                <p className={`${styles.leaderboardFilter} ${selectedWords === null ? styles.activeFilter : ''} `}
                   onClick={() => handleLeaderboardChange(null)}>All time</p>
                <p className={`${styles.leaderboardFilter} ${selectedWords === 10 ? styles.activeFilter : ''} `}
                   onClick={() => handleLeaderboardChange(10)}>Words 10</p>
                <p className={`${styles.leaderboardFilter} ${selectedWords === 15 ? styles.activeFilter : ''} `}
                   onClick={() => handleLeaderboardChange(15)}>Words 15</p>
                <p className={`${styles.leaderboardFilter} ${selectedWords === 20 ? styles.activeFilter : ''} `}
                   onClick={() => handleLeaderboardChange(20)}>Words 20</p>
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
                                <li
                                    key={user.id}
                                    className={username === user.user.username ? styles.currentUser : styles.rangElement}
                                    onClick={() => typeof window !== 'undefined' && (window.location.href = `/run/${user.id}`)}
                                >
                                    <h2 className={styles.rangTitle}>
                                        {i + 1} {user.user.username}
                                    </h2>
                                    <h3 className={styles.rangStat}>WPM: {user.wpm}</h3>
                                    {width > 700 && <h3 className={styles.rangStat}>Acc: {user.accuracy}%</h3>}
                                    {width > 950 && <h3 className={styles.rangStat}>{formattedDate}</h3>}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}