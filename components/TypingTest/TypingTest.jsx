import { useEffect, useState, useRef } from "react";
import styles from "./TypingTest.module.css";
import WordsAPI from "../../lib/api/Words.js";
import TypingResultAPI from "../../lib/api/TypingResult.js";
import {useGlobalContext} from "../../store/index.js";

let Words = null;

const TypingTest = ({ wordCount = 10 }) => {
    const stopTimer = () => setIsActive(false);
    const startTimer = () => setIsActive(true);
    const { session, login, logout } = useGlobalContext();
    const [displayLetters, setDisplayLetters] = useState("");
    const [userLetters, setUserLetters] = useState("");
    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [results, setResults] = useState({
        accuracy: "",
        raw: "",
        wpm: "",
        cpm: "",
        time: "",
        words: "",
        characters: "",
        sentence: "",
        timestamp: ""
    });
    const [showResults, setShowResults] = useState(false);
    const textRef = useRef(null);
    const cursorRef = useRef(null);

    const fetchWordsOnce = async () => {
        if (Words) return Words;

        try {
            const data = await WordsAPI.getWords();
            //const data = await response.json();
            Words = data.map(entry => entry.word);
            return Words;
        } catch (error) {
            console.error("Error fetching words:", error);
            return [];
        }
    };

    const generateRandomLetters = async (wordCount) => {
        const words = await fetchWordsOnce();

        if (!words.length) return "";

        let result = "";
        for (let i = 0; i < wordCount; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            result += words[randomIndex] + " ";
        }

        return result.trim();
    };

    useEffect(() => {
        generateRandomLetters(wordCount).then((result) => {
            setDisplayLetters(result);
        });
    }, [wordCount]);

    useEffect(() => {
        if (userLetters.length === displayLetters.length && userLetters.length > 0) {
            handleFinish();
        }
    }, [userLetters, displayLetters]);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setCount((prevCount) => prevCount + 0.1);
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (!textRef.current || !cursorRef.current || showResults) return;

        const spans = textRef.current.getElementsByTagName("span");
        const currentPos = userLetters.length;

        if (spans.length > 0) {
            const targetSpan = currentPos === 0 ? spans[0] : spans[Math.min(currentPos, spans.length - 1)];
            const rect = targetSpan.getBoundingClientRect();
            const containerRect = textRef.current.getBoundingClientRect();

            cursorRef.current.style.left = `${rect.left - containerRect.left}px`;
            cursorRef.current.style.top = `${rect.top - containerRect.top}px`;
            cursorRef.current.style.height = `${rect.height}px`;
        }
    }, [userLetters, displayLetters, showResults]);


    const resetTest = () => {
        setResults({
            acc: "",
            raw: "",
            wpm: "",
            cpm: "",
            time: "",
            words: "",
            characters: ""
        });

        generateRandomLetters(wordCount).then((result) => {
            setDisplayLetters(result);
            setUserLetters("");
            setCount(0);
            stopTimer();
        });
    };

    const addLetter = (letter) => {
        const updated = userLetters + letter;
        setUserLetters(updated);
    };

    const handleFinish = () => {
        stopTimer();
        let correct = 0;
        let incorrect = 0;

        displayLetters.split("").forEach((char, i) => {
            if (userLetters[i] === char) correct += 1;
            else incorrect += 1;
        });

        const timeInMinutes = count / 60;
        const cpm = Math.round(correct / timeInMinutes) || 0;
        const accInDec = correct / (incorrect + correct) || 0;
        const acc = Math.round(accInDec * 100);
        const wpm = Math.round((wordCount / timeInMinutes) * accInDec) || 0;

        const newResults = {
            accuracy: acc,
            raw: Math.round(wordCount / timeInMinutes),
            wpm: wpm,
            cpm: cpm,
            time: Math.round(count * 100) / 100,
            words: wordCount,
            characters: (incorrect + correct),
            sentence: displayLetters,
            timestamp: Date.now()
        };

        console.log("Calculated Results:", newResults);

        setResults(newResults);
        setShowResults(true);

        if (session) {
            TypingResultAPI.saveResult(newResults, session.accessToken)
                .then(response => console.log("API Response:", response))
                .catch(error => console.error("API Error:", error));
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            resetTest();
            if (showResults) {
                setShowResults(false);
            } else if (results.acc !== "") {
                setShowResults(true);
            }
            return;
        }

        if (!showResults) {
            if ((e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) || e.key === " ") {
                if (userLetters.length === 0) startTimer();
                addLetter(e.key);
                e.preventDefault();
            }
            if (e.key === "Backspace") {
                setUserLetters(userLetters.slice(0, -1));
                if (userLetters.length === 1) stopTimer();
                e.preventDefault();
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [userLetters, displayLetters, showResults, results]);

    return (
        <div className={styles.container}>
            <div className={`${styles.viewContainer} ${showResults ? styles.showResults : styles.showTyping}`}>
                <div className={styles.typingView}>
                    <div className={styles.generatedText} ref={textRef}>
                        {displayLetters.split("").map((char, i) => {
                            let className = styles.default;
                            if (userLetters[i]) {
                                className = userLetters[i] === char ? styles.correct : styles.wrong;
                            }
                            return (
                                <span key={i} className={className}>
                                    {char}
                                </span>
                            );
                        })}
                        {!showResults && <div ref={cursorRef} className={styles.cursor}></div>}
                    </div>
                </div>
                <div className={styles.resultsView}>
                    <div className={styles.displayResult}>
                        <p>Raw WPM: {results.raw}</p>
                        <p>WPM: {results.wpm}</p>
                        <p>CPM: {results.cpm}</p>
                        <p>Accuracy: {results.accuracy}%</p>
                        <p>Time: {results.time}</p>
                        <p>Words: {results.words}</p>
                        <p>Characters: {results.characters}</p>
                        <p>Press Tab to try again</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingTest;