import { useEffect, useState, useRef } from "react";
import styles from "./TypingTest.module.css";
import WordsAPI from "../../lib/api/Words.js";
import TypingResultAPI from "../../lib/api/TypingResult.js";
import { useGlobalContext } from "../../store/index.js";

let Words = null;

const TypingTest = () => {
    const stopTimer = () => setIsActive(false);
    const startTimer = () => setIsActive(true);

    const { session, login, logout } = useGlobalContext();

    const [wordCount, setWordCount] = useState(10);
    const [wrongChars, setWrongChars] = useState([]);
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
        userInput: "",
        timestamp: ""
    });
    const [showResults, setShowResults] = useState(false);
    const textRef = useRef(null);
    const cursorRef = useRef(null);

    const fetchWordsOnce = async () => {
        if (Words) return Words;
        try {
            const data = await WordsAPI.getWords();
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
            accuracy: "",
            raw: "",
            wpm: "",
            cpm: "",
            time: "",
            words: "",
            characters: "",
            sentence: "",
            userInput: ""
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
        const wrongPositions = [];

        displayLetters.split("").forEach((char, i) => {
            if (userLetters[i] === char) {
                correct += 1;
            } else {
                incorrect += 1;
                wrongPositions.push({
                    position: i,
                    expected: char,
                    typed: userLetters[i] || null
                });
            }
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
            userInput: userLetters,
            timestamp: Date.now()
        };

        setWrongChars(wrongPositions);
        setResults(newResults);
        setShowResults(true);

        if (session) {
            if (acc > 70) {
                const response = TypingResultAPI.saveResult(newResults, session.accessToken)
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            resetTest();
            if (showResults) {
                setShowResults(false);
            } else if (results.accuracy !== "") {
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

    const handleReturn = () => {
        setShowResults(false);
        resetTest();
    };

    const handleWordAmount = (e) => {
        e.preventDefault();
        setWordCount(e.target.textContent);
        setShowResults(false);
        resetTest();
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [userLetters, displayLetters, showResults, results]);

    return (
        <div className={styles.container}>
            <div className={`${showResults ? styles.showResults : styles.showTyping} ${styles.settingsContainer} `}>
                <div className={styles.settingsIcons}>
                    <p>Words: </p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>10</p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>15</p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>20</p>
                    <p>|</p>
                    <p className={styles.settingsClickable} onClick={handleReturn}>Clear</p>
                </div>
            </div>
            <div className={`${styles.viewContainer} ${showResults ? styles.showResults : styles.showTyping}`}>
                <div className={styles.typingView}>
                    <div className={styles.generatedText} ref={textRef} key={displayLetters}>
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
                    {!session &&
                        <div className={styles.infoContainer}>
                            <i className="material-icons">info_outline</i>
                            <p> You have to be logged in, to save your results! </p>
                        </div>}
                </div>
                <div className={styles.resultsView}>
                    <div className={styles.displayResult}>
                        <div className={styles.topResults}>
                            <div>
                                <h3>WPM: {results.wpm}</h3>
                                <h3>Acc: {results.accuracy}%</h3>
                            </div>
                            <div>
                                <h2>
                                    {results.sentence.split("").map((char, i) => {
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
                                    }
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
                            <p>Press Tab to try again</p>
                            <div className={styles.returnMobile} onClick={handleReturn}>
                                <p>Return</p>
                                <i className="material-icons">subdirectory_arrow_left</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingTest;