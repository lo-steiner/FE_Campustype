import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import { useGlobalContext } from  "../../store/index.js";
import NavigationMobile from "../Navigation/NavigationMobile";

const Navigation = () => {
    const { session, login, logout } = useGlobalContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <nav className={styles.nav}>
            <div id="nav-icon3" className={`${styles.navIcon} ${isOpen ? styles.open : ''}`} onClick={handleClick}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className={styles.links}>
                <ul>
                    <li><Link href="/">Leaderboard</Link></li>
                    {session ? (
                        <li><Link href="/profile">Profile</Link></li>
                    ) : (
                        <li><Link href="/login">Login</Link></li>
                    )}
                    {session && (
                        <li><Link href="/" onClick={() => logout()}>Logout</Link></li>
                    )}
                    <li><Link href="/aboutus">About Us</Link></li>
                </ul>
            </div>
            <NavigationMobile isOpen={isOpen}/>
        </nav>
    );
};

export default Navigation;