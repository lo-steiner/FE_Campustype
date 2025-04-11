import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './NavigationMobile.module.css';
import { useGlobalContext } from "../../store/index.js";
import {Bounce, toast} from "react-toastify";

const NavigationMobile = ({ isOpen, setIsOpen }) => {
    const { session, login, logout } = useGlobalContext();
    const [isClient, setIsClient] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleNavPress = () => {
        setIsOpen(false);
    };

    const handleLogOut = () => {
        setIsOpen(false);
        toast.success("Logout successfull!", { transition: Bounce });
        logout();
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        try {
            const storedSession = localStorage.getItem('session');
            if (storedSession) {
                const session = JSON.parse(storedSession);
                setUserId(session.userId);
            }
        } catch (error) {
            localStorage.clear();
        }
    }, [session]);


    return (
        <div className={`${styles.navTab} ${isOpen ? styles.open : ''}`}>
            <Link href="/leaderboard" title="Leaderboard">
                <div className={styles.navTabLinks} onClick={handleNavPress}>
                    <p>Leaderboard</p>
                </div>
            </Link>
            {session ? (
                <Link href={`/profile/${userId}`} title="Profile">
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
            <Link href="/aboutus" title="About Us">
                <div className={styles.navTabLinks} onClick={handleNavPress}>
                    <p>About Us</p>
                </div>
            </Link>
        </div>
    );
};

export default NavigationMobile;