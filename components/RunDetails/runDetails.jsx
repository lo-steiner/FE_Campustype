import { useEffect, useState } from "react";
import LeaderboardAPI from "../../lib/api/Leaderboard.js";
import styles from './styles.module.css'



export default function Leaderboard({props}) {

    return (
        <div>
            <h4>WPM: {props.wpm}</h4>
            <h4>RAW: {props.raw}</h4>
            <h4>CPM: {props.cpm}</h4>
            <h4>ACC: {props.accuracy}%</h4>
            <h4>User: {props.user.username}</h4>
            <h4>Sentence: {props.sentence}</h4>
        </div>
    );
}
