import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import { useGlobalContext } from "../../store/index.js";
import NavigationMobile from "../Navigation/NavigationMobile";
import { Bounce, toast } from "react-toastify";

const Navigation = () => {
    const { session, logout } = useGlobalContext();
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        toast.success("Logout successfull!", { transition: Bounce });
        setIsOpen(false);
    }


    useEffect(() => {
        try {
            const storedSession = localStorage.getItem('session');
            if (storedSession) {
                const session = JSON.parse(storedSession);
                setUserId(session.userId);
            }
        } catch (error) {
            console.error('LocalStorage error:', error);
            localStorage.clear();
        }
    }, [session]);

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
                    <li><Link href="/leaderboard">Leaderboard</Link></li>
                    {session ? (
                        userId && <li><Link href={`/profile/${userId}`}>Profile</Link></li>
                    ) : (
                        <li><Link href="/login">Login</Link></li>
                    )}
                    {session && (
                        <li><Link href="/" onClick={handleLogout}>Logout</Link></li>
                    )}
                    <li><Link href="/aboutus">About Us</Link></li>
                </ul>
            </div>
            <NavigationMobile isOpen={isOpen} setIsOpen={setIsOpen}
            />
        </nav>
    );
};

export default Navigation;