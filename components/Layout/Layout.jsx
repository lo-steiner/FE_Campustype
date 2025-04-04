import React from 'react';
import Head from "next/head.js";
import styles from "./Layout.module.css"
import {Bounce, ToastContainer} from "react-toastify";

const Layout = ({ children }) => {

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>CampusType</title>
            </Head>
            <main>
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    closeOnClick
                    pauseOnHover={false}
                    draggable={false}
                    transition={Bounce}
                />
            </main>
        </>
    );
};

export default Layout;