import Link from 'next/link';
import styles from '../styles/aboutus.module.css';

export default function AboutUs() {
  return (
    <div className={styles.body}>
        <div className={styles.imgContainer}>
            <div className={styles.images}>
                <Link href="/profile/161"><img id={styles.levy} src="/Levy.png" alt="Bildbeschreibung"/></Link>
                <h1>Levy</h1>
                <h3>Italian</h3>
            </div>
            
            <div className={styles.images}>
                <Link href="/profile/132"><img id={styles.oli} src="/Oli.png" alt="Bildbeschreibung"/></Link>
                <h1>Oli</h1>
                <h3>Designer</h3>
            </div>
        </div>
    </div>
  );
}