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
        <div>
            <h1>Leaderboard</h1>
            {users.length > 0 && (
                <ul>
                    {
                        users.map((user, i) => (
                            <li key={user.id} className={styles.rangElement}>
                                <h3>{i + 1}</h3>
                                <h2>{user.user.username}</h2>
                                <h3>WPM: {user.wpm}</h3>
                                <h3>Accuracy: {user.accuracy}%</h3>
                                <h3>{user.timestamp}</h3>
                            </li>
                        ))
                    }
                </ul>
            )}
        </div>
    )
}