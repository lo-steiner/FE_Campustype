import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './RunDetails.module.css'
import Link from 'next/Link'



export default function Leaderboard({props}) {
    const results = props;

    return (
        <div className={styles.container}>
            <div className={styles.viewContainer}>
                <div className={styles.resultsView}>
                    <div className={styles.displayResult}>
                        <div className={styles.topResults}>
                            <div>
                                <h3>WPM: {results.wpm}</h3>
                                <h3>Acc: {results.accuracy}%</h3>
                            </div>
                            <div>
                                <h2>
                                    {results.sentence ? (results.sentence.split("").map((char, i) => {
                                            const userChar = results.userInput[i];
                                            const isCorrect = userChar === char;
                                            if (char === " " && userChar && !isCorrect) {
                                                return (
                                                    <span key={i} className={styles.wrongSpace}> _ </span>
                                                );
                                            }
                                            return (
                                                <span key={i} className={userChar ? (isCorrect ? styles.correct : styles.wrong) : styles.default}>
                                                    {char}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <p>No sentence available</p>
                                    )}
                                </h2>
                            </div>
                        </div>
                        <div className={styles.bottomResults}>
                            <h3>Raw: {results.raw}</h3>
                            <h3>CPM: {results.cpm}</h3>
                            <h3>Time: {results.time}</h3>
                            <h3>Words: {results.words}</h3>
                        </div>
                        <div className={styles.returnIcons}>
                            <Link href='/leaderboard'>
                                <div className={styles.returnMobile}>
                                    <p>Return</p>
                                    <i className="material-icons">subdirectory_arrow_left</i>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
