import styles from "./Leaderboard.module.css";

export default function LeaderboardPlaceholder () {
    return(
        <li className={styles.rangElement}>
            <h2 className={styles.rangTitle}>
                <span className={styles.loadingPlaceholderText}></span>
            </h2>
            <h3 className={styles.rangStat}>
                WPM: <span className={styles.loadingPlaceholderText}></span>
            </h3>
            {width > 700 && (
                <h3 className={styles.rangStat}>
                    Accuracy: <span className={styles.loadingPlaceholderText}></span>
                </h3>
            )}
            {width > 950 && (
                <h3 className={styles.rangStat}>
                    <span className={styles.loadingPlaceholderText}></span>
                </h3>
            )}
        </li>
    );
};
