// pages/404.js
import { useEffect } from 'react';
import TheaterJS from 'theaterjs';
import styles from '../styles/404.module.css';

export default function NotFound() {
    useEffect(() => {
        const theater = TheaterJS({
            autoplay: true,
            locale: 'en',
        });

        theater
            .on('type:start, erase:start', () => {
                const actor = theater.getCurrentActor();
                actor.$element.classList.add(styles['actor__content--typing']);
            })
            .on('type:end, erase:end', () => {
                const actor = theater.getCurrentActor();
                actor.$element.classList.remove(styles['actor__content--typing']);
            });

        const errorMessages = [
            'What, can’t you type a real URL?',
            'This page ran away because you’re too slow.',
            'Maybe if you weren’t so clumsy, this page would exist.',
            'The keys hate you, and so does this page.',
            'You typed that? No wonder it’s missing.',
        ];

        const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

        theater
            .addActor('ErrorMessage', { speed: 1, accuracy: 1 })
            .addActor('TipMessage', { speed: 1, accuracy: 0.7 })
            .addActor('PageNotFound', { speed: 1, accuracy: 0.7 });

        theater
            .addScene('PageNotFound:Page Not Found')
            .addScene(`ErrorMessage:${randomErrorMessage}`, 200)
            .addScene('PageNotFound:Press Random Keys to see an easter egg', 2000)
            .addScene('PageNotFound:Page Not Found');

        theater
            .addScene('TipMessage:Tip: Master your keyboard with daily practice.', 5000)
            .addScene('TipMessage:Tip: Speed comes from precision, not haste.', 5000)
            .addScene('TipMessage:Tip: Type like the wind, steady and sure.', 5000)
            .addScene('TipMessage:Tip: Fingers on home row, ready to go.', 5000)
            .addScene('TipMessage:Tip: Mistakes are lessons, not setbacks.', 5000)
            .addScene('TipMessage:Tip: Punctuation is power - learn it well.', 5000)
            .addScene('TipMessage:Tip: Quick hands win the typing race.', 5000)
            .addScene('TipMessage:Tip: Relax and let the words flow free.', 5000)
            .addScene('TipMessage:Tip: Common words are your secret weapon.', 5000)
            .addScene('TipMessage:Tip: Consistency beats speed every time.', 5000)
            .addScene(() => {
                theater
                    .addScene('TipMessage:Tip: Master your keyboard with daily practice.', 1000)
                    .addScene('TipMessage:Tip: Speed comes from precision, not haste.', 1000)
                    .addScene('TipMessage:Tip: Type like the wind, steady and sure.', 1000)
                    .addScene('TipMessage:Tip: Fingers on home row, ready to go.', 1000)
                    .addScene('TipMessage:Tip: Mistakes are lessons, not setbacks.', 1000)
                    .addScene('TipMessage:Tip: Punctuation is power - learn it well.', 1000)
                    .addScene('TipMessage:Tip: Quick hands win the typing race.', 1000)
                    .addScene('TipMessage:Tip: Relax and let the words flow free.', 1000)
                    .addScene('TipMessage:Tip: Common words are your secret weapon.', 1000)
                    .addScene('TipMessage:Tip: Consistency beats speed every time.', 1000)
                    .addScene(theater.replay.bind(theater));
            });

        const handleKeyPress = (event) => {
            const key = event.key;
            if (key.length === 1) {
                const letter = document.createElement('span');
                letter.textContent = key;
                letter.className = styles.backgroundLetter;

                const x = Math.random() * (window.innerWidth - 50);
                const y = Math.random() * (window.innerHeight - 50);
                letter.style.left = `${x}px`;
                letter.style.top = `${y}px`;

                document.body.appendChild(letter);

                setTimeout(() => {
                    letter.remove();
                }, 2000);
            }
        };

        document.addEventListener('keydown', handleKeyPress);


        return () => {
            theater.stop();
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <div className={styles.scene}>
            <div className={styles.container}>
                <div>
                    <div className={styles.title}>404</div>
                </div>
                <div>
                    <div id="PageNotFound" className={styles.errormessage}>Page Not Found</div>
                </div>
                <div className={styles.actor}>
                    <div id="ErrorMessage" className={`${styles.actor__content} ${styles.message}`}></div>
                </div>
                <div className={styles.actor}>
                    <div id="TipMessage" className={`${styles.actor__content} ${styles.tips}`}></div>
                </div>
            </div>
        </div>
    );
}