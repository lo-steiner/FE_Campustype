import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image';
import Link from "next/link";

const Footer = () => {
    return (
        <footer>
            <div className={styles.footerContainer}>
                <Link href="/contactus">
                    <p>Contact Us</p>
                </Link>
                <Link href="/agb">
                    <p>AGBs</p>
                </Link>
                <Link href="/impressum">
                    <p>Impressum</p>
                </Link>
                <Link href="/aboutus">
                    <p>About Us</p>
                </Link>
            </div>
        </footer>
    );
};

export default Footer;