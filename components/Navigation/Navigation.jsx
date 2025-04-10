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
    const [width, setWidth] = useState(0);


    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        toast.success("Logout successfull!", { transition: Bounce });
        setIsOpen(false);
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <nav className={styles.nav}>
            {width < 830 ? (
                <div id="nav-icon3" className={`${styles.navIcon} ${isOpen ? styles.open : ''}`} onClick={handleClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <div className={styles.links}>
                <ul>
                    <li><Link href="/leaderboard" title="Leaderboard">Leaderboard</Link></li>
                    {session ? (
                        userId && <li><Link href={`/profile/${userId}`} title="Profile">Profile</Link></li>
                    ) : (
                        <li><Link href="/login" title="Login">Login</Link></li>
                    )}
                    {session && (
                        <li><Link href="/" onClick={handleLogout} title="Logout">Logout</Link></li>
                    )}
                    <li><Link href="/aboutus" title="About Us">About Us</Link></li>
                </ul>
            </div>)}
            <NavigationMobile isOpen={isOpen} setIsOpen={setIsOpen}
            />
        </nav>
    );
};

export default Navigation;