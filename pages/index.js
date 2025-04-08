import TypingTest from "../components/TypingTest/TypingTest.jsx";
import styles from "../styles/index.module.css"

export default function Home() {
  return (
      <div className={styles.typingTestContainer}>
        <TypingTest wordCount={10} apiUrl="http://ndeszynskio:8080/api/words/10" />
      </div>
  );
}