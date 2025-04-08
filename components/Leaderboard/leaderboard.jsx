import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './styles.module.css'

export default function leaderboard() {
    const[ users, setUsers ] = useState([]);

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
                {users.map((user, i) => (
                  <li
                    key={user.id}
                    className={
                      localStorage.getItem("username") === user.username
                        ? styles.currentUser
                        : styles.rangElement
                    }
                  >
                    <h2 className={styles.rangTitle}>
                      {i + 1} {user.user.username}
                    </h2>
                    <h3 className={styles.rangStat}>WPM: {user.wpm}</h3>
                    <h3 className={styles.rangStat}>Accuracy: {user.accuracy}%</h3>
                    <h3 className={styles.rangStat}>{user.timestamp}</h3>
                  </li>
                ))}
              </ul>
            )}
        </div>
    );
}