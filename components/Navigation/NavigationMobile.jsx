import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './NavigationMobile.module.css';
import { useGlobalContext } from "../../store/index.js";

const NavigationMobile = ({ isOpen, setIsOpen }) => {
    const { session, login, logout } = useGlobalContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleNavPress = () => {
        setIsOpen(false);
    };

    const handleLogOut = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <div className={`${styles.navTab} ${isOpen ? styles.open : ''}`}>
            <Link href="/" title="HomePage">
                <div className={`${styles.navTabLinks}`} onClick={handleNavPress}>
                    <p>Home</p>
                </div>
            </Link>
            <Link href="/leaderboard" title="Leaderboard">
                <div className={styles.navTabLinks} onClick={handleNavPress}>
                    <p>Leaderboard</p>
                </div>
            </Link>
            {session ? (
                <Link href="/#" title="Profile">
                    <div className={styles.navTabLinks} onClick={handleNavPress}>
                        <p>Profile</p>
                    </div>
                </Link>
            ) : (
                <Link href="/login" title="Login">
                    <div className={styles.navTabLinks} onClick={handleNavPress}>
                        <p>Login</p>
                    </div>
                </Link>
            )}
            {session && (
                <Link href="/" title="Logout">
                    <div className={styles.navTabLinks} onClick={handleLogOut}>
                        <p>Logout</p>
                    </div>
                </Link>
            )}
            <Link href="/#" title="About Us">
                <div className={styles.navTabLinks} onClick={handleNavPress}>
                    <p>About Us</p>
                </div>
            </Link>
        </div>
    );
};

export default NavigationMobile;