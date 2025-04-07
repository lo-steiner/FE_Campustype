import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import UsersAPI from "../../lib/api/Users.js";
import { useGlobalContext } from "../../store/index.js";
import { router } from "next/client.js";
import styles from "./ProfileForm.module.css";

const LoginForm = ({ post }) => {
    const { session, login, logout } = useGlobalContext();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const validateUser = (user) => {
        if (user.email === "") {
            setError("Email can't be empty");
            return false;
        }
        if (user.password === "") {
            setError("Password can't be empty");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateUser(user)) {
            return;
        }

        console.log(`user: ${user.email} ${user.password}`)

        setIsLoading(true);

        try {
            console.log(`${user} before reuqest`)
            const response = await UsersAPI.login(user);
            console.log(`${response} after reuqest`)


            if (!response) {
                return;
            }

            login(response);

            toast.success("Login erfolgreich!", {
                transition: Bounce,
            });

            router.push("/");
        } catch (err) {
            toast.error("Invalid Credentials", {
                transition: Bounce,
            });
        }
        setIsLoading(false);
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={styles.formContainerStyling}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputField}>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        value={user.email}
                        placeholder=" "
                        required
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className={styles.inputField}>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        id="password"
                        value={user.password}
                        placeholder=" "
                        required
                    />
                    <label htmlFor="password">Password</label>
                </div>

                <p className={styles.error}>{error}</p>

                <div className={styles.bottomButtons}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;