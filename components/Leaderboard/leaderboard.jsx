import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './styles.module.css'

const STORAGE_KEY = 'session'

export default function Leaderboard() {
    const[ users, setUsers ] = useState([]);
    const months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    const getUsername = () => {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const sessionData = JSON.parse(storedData);
            return sessionData.username;
        }
        return null;
    };

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await LeaderboardAPI.getUsers();
                setUsers(response)
            } catch (error) {
                console.error("Failed to load Users: ", error)
            }
        }
        getUsers()
    }, [])

    console.log(users)

    return (
        <div className={styles.leaderboardContainer}>
          <h1 className={styles.leaderboardTitle}>LEADERBOARD</h1>
          {users.length > 0 && (
            <ul className={styles.leaderboardList}>
              {users.map((user, i) => {
                const username = getUsername()
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
                    className={
                        username === user.user.username
                        ? styles.currentUser
                        : styles.rangElement
                    }
                  >
                    <h2 className={styles.rangTitle}>
                      {i + 1} {user.user.username}
                    </h2>
                    <h3 className={styles.rangStat}>WPM: {user.wpm}</h3>
                    <h3 className={styles.rangStat}>Accuracy: {user.accuracy}%</h3>
                    <h3 className={styles.rangStat} id={styles.rangStat}>{formattedDate}</h3>
                  </li>
                );
              })}
            </ul>
          )}

        </div>
      );
}