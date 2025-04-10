import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TypingResultAPI from '../../lib/api/TypingResult';
import styles from './profile.module.css'
import Link from 'next/Link';
import Image from 'next/image';

function calculateAverage(array, field) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[field] || 0), 0);
    return Number((sum / array.length).toFixed(2));
}

function calculateSum(array, field) {
    if (!array || array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[field] || 0), 0);
    return sum.toFixed(1);
}

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const [results, setResults] = useState(null);
    const [ user, setUser ] = useState()

    useEffect(() => {
        if (!id) return;

        const fetchResults = async () => {
            try {
                const data = await TypingResultAPI.getResults(id);
                setResults(data);
                console.log(data)
                setUser(data[0].user);
            } catch (error) {
                console.error('Fehler beim Abrufen der Ergebnisse:', error);
            }
        };

        fetchResults();
    }, [id]);

    const avgWpm = calculateAverage(results, 'wpm');
    const avgCpm = calculateAverage(results, 'cpm');
    const avgAccuracy = calculateAverage(results, 'accuracy');
    const timePlayed = calculateSum(results, 'time')

    return user && (
        <div className={styles.body}>
            <div className={styles.topContainer}>
                <div className={styles.profileContainer}>
                    <img src="https://placehold.co/200x200?text=Campus+Type" alt="Campus Type" />
                    <div className={styles.profileStats}>
                        <h2>{user.username}</h2>
                        <h4>tests completed </h4>
                        <h3>{results.length}</h3>
                        <h4>time typing</h4>
                        <h3>{timePlayed} sec</h3>
                    </div>
                </div>
                <div id={styles.seperator}>
                </div>
                <div className={styles.rightContainer}>
                    <h4>bio</h4>
                    <p>{user.bio}</p>
                    <h4>keyboard</h4>
                    <p>{user.keyboard}</p>
                    <Link href={`/profile/edit/${user.id}`}><i class="large material-icons">mode_edit</i></Link>
                </div>
            </div>
            <div className={styles.bottomContainer}>
                <div className={styles.statsContainer}>
                    <div className={styles.stats}>
                        <h3>WPM</h3>
                        <h2>{avgWpm}</h2>
                    </div>
                    <div className={styles.stats}>
                        <h3>CPM</h3>
                        <h2>{avgCpm}</h2>
                    </div>
                    <div className={styles.stats}>
                        <h3>ACC</h3>
                        <h2>{avgAccuracy}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}