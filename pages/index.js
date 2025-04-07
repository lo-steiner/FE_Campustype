import { useEffect, useState } from "react";
import styles from '../styles/index.module.css';

export default function Home() {
  const [displayLetters, setDisplayLetters] = useState('');
  const [userLetters, setUserLetters] = useState('');
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const wordsCount = 10;

  const generateRandomLetters = async (wordCount) => {
    try {
      const response = await fetch('http://ndeszynskio:8080/api/words/10');
      const data = await response.json();
      console.log(data)
      const words = data.map(entry => entry.word);

      let result = '';
      for (let i = 0; i < wordCount; i++) {
        const randomWord = words[i];
        result += randomWord + ' ';
      }

      return result.trim();
    } catch (error) {
      console.error('Fehler beim Laden:', error);
      return '';
    }
  };

  // Load random letters on component mount
  useEffect(() => {
    generateRandomLetters(wordsCount).then((result) => {
      setDisplayLetters(result);
    });
  }, []);

  // Check if user has finished typing
  useEffect(() => {
    if (userLetters.length === displayLetters.length && userLetters.length > 0) {
      handleFinish();
    }
  }, [userLetters, displayLetters]);

  // Timer logic
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const stopTimer = () => {
    setIsActive(false);
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const randomLetters = () => {
    generateRandomLetters(wordsCount).then((result) => {
      setDisplayLetters(result);
      setUserLetters('');
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

    displayLetters.split('').forEach((char, i) => {
      if (userLetters[i] === char) {
        correct += 1;
      } else {
        incorrect += 1;
      }
    });

    const timeInMinutes = count / 60;
    const cpm = correct / timeInMinutes;
    const accInDec = correct / (incorrect + correct);
    const acc = Math.round(accInDec * 100);
    const wpm = (wordsCount / timeInMinutes) * accInDec;

    console.log("ACC: ", acc, "%");
    console.log("WPM: ", wpm);
    console.log("CPM: ", cpm);
  };

  const handleKeyDown = (e) => {
    if ((e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) || e.key === ' ') {
      if (userLetters.length === 0) {
        startTimer();
      }
      addLetter(e.key);
      e.preventDefault();
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      randomLetters();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} style={{ outline: 'none' }}>
      <button onClick={randomLetters}>Generate Random Letters</button>
      <p>{count}</p>
      <div>
        {displayLetters.split('').map((char, i) => {
          let color = 'white';
          if (userLetters[i]) {
            color = userLetters[i] === char ? 'green' : 'red';
          }
          return (
            <span key={i} style={{ color }}>
              {char}
            </span>
          );
        })}
      </div>
      <p>Eingegeben: {userLetters}</p>
    </div>
  );
}