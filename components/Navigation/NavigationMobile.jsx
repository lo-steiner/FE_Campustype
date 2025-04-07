import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './NavigationMobile.module.css';
import { useGlobalContext } from "../../store/index.js";

const NavigationMobile = ({ isOpen }) => {
    const { session, login, logout } = useGlobalContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className={`${styles.navTab} ${isOpen ? styles.open : ''}`}>
            <Link href="/" title="HomePage">
                <div className={`${styles.navTabLinks}`}>
                    <p>Home</p>
                </div>
            </Link>
            {session ? (
                <Link href="/profile" title="Profile">
                    <div className={styles.navTabLinks}>
                        <p>Profil</p>
                    </div>
                </Link>
            ) : (
                <Link href="/login" title="Profile">
                    <div className={styles.navTabLinks}>
                        <p>Login</p>
                    </div>
                </Link>
            )}
            <Link href="/posts/create" title="Profile">
                <div className={styles.navTabLinks}>
                    <p>Create</p>
                </div>
            </Link>
            {session && (
                <Link href="/" title="Profile" onClick={() => logout()}>
                    <div className={styles.navTabLinks}>
                        <p>Logout</p>
                    </div>
                </Link>
            )}
        </div>
    );
};

export default NavigationMobile;