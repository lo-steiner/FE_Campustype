import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TypingResultAPI from '../../lib/api/TypingResult';
import UsersAPI from '../../lib/api/Users';
import { useGlobalContext } from '../../store';
import { toast, Bounce } from 'react-toastify';
import styles from './UpdateForm.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const { session, login } = useGlobalContext();
    const [errors, setErrors] = useState({ username: "", email: "", password: "", passwordConfirm: "", bio: "", keyboard: "" });
    const [user, setUser] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchResults = async () => {
            try {
                const data = await UsersAPI.getUser(id);
                const session = JSON.parse(localStorage.getItem('session'))
                if (session) {
                    if (parseInt(id) !== session.userId) {
                        router.push(`/profile/${id}`)
                        toast.error("You cant edit other profiles!", { transition: Bounce });
                    }
                } else {
                    router.push(`/profile/${id}`)
                    toast.error("You must be logged in!", { transition: Bounce });
                }
                setUser(data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Ergebnisse:', error);
            }
        };

        fetchResults();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        setErrors({ ...errors, [name]: "" });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setErrors({ ...errors, passwordConfirm: "" });
    };

    const validateUser = (user) => {
        let isValid = true;
        const newErrors = { username: "", email: "", password: "", passwordConfirm: "", bio: "", keyboard: "" };

        if (!user.username) {
            newErrors.username = "Username can't be empty";
            isValid = false;
        } else if (user.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        } else if (user.username.length > 50) {
            newErrors.username = "Username is too long (max 50 characters)";
            isValid = false;
        }

        if (!user.email) {
            newErrors.email = "Email can't be empty";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        } else if (user.email.length > 255) {
            newErrors.email = "Email is too long (max 255 characters)";
            isValid = false;
        }

        if (user.password) {
            if (user.password.length < 5) {
                newErrors.password = "Password must be at least 5 characters";
                isValid = false;
            } else if (user.password.length > 255) {
                newErrors.password = "Password is too long (max 255 characters)";
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(user.password)) {
                newErrors.password = "Password must contain uppercase, lowercase, and a number";
                isValid = false;
            }

            if (user.password !== confirmPassword) {
                newErrors.passwordConfirm = "Passwords must match";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const saveChanges = async () => {
        if (!validateUser(user)) return;

        const sessionData = JSON.parse(localStorage.getItem("session"));
        const token = sessionData?.accessToken;

        if (!token) {
            toast.error("You need to be logged in to save changes.", { transition: Bounce });
            return;
        }

        try {
            const response = await UsersAPI.update(user, token);
            const { user: updatedUser, token: newToken } = response;

            setUser(updatedUser);

            const updatedSession = {
                accessToken: newToken,
                username: updatedUser.username,
                email: updatedUser.email,
                userId: updatedUser.id,
            };
            localStorage.setItem("session", JSON.stringify(updatedSession));

            login({ accessToken: newToken });

            toast.success("Profile updated successfully!", { transition: Bounce });
            router.push(`/profile/${id}`)
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.", { transition: Bounce });
        }
    };

    return user ? (
        <div className={styles.formContainerStyling}>
            <h1>Update Profile</h1>
            <div className={errors.username ? styles.inputFieldError : styles.inputField}>
                <input
                    onChange={handleChange}
                    name="username"
                    id="username"
                    value={user.username || ''}
                    placeholder=" "
                />
                <label htmlFor="username">Username</label>
            </div>
            {errors.username && <p className={styles.error}>{errors.username}</p>}

            <div className={errors.email ? styles.inputFieldError : styles.inputField}>
                <input
                    onChange={handleChange}
                    name="email"
                    id="email"
                    value={user.email || ''}
                    placeholder=" "
                />
                <label htmlFor="email">Email</label>
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <div className={errors.bio ? styles.inputFieldError : styles.inputField}>
                <textarea
                    onChange={handleChange}
                    name="bio"
                    id="bio"
                    value={user.bio || ''}
                    placeholder=" "
                    rows="4"
                />
                <label htmlFor="bio">Bio</label>
            </div>
            {errors.bio && <p className={styles.error}>{errors.bio}</p>}

            <div className={errors.keyboard ? styles.inputFieldError : styles.inputField}>
                <input
                    onChange={handleChange}
                    name="keyboard"
                    id="keyboard"
                    value={user.keyboard || ''}
                    placeholder=" "
                />
                <label htmlFor="keyboard">Keyboard</label>
            </div>
            {errors.keyboard && <p className={styles.error}>{errors.keyboard}</p>}

            <div className={errors.password ? styles.inputFieldError : styles.inputField}>
                <input
                    onChange={handleChange}
                    name="password"
                    id="password"
                    type="password"
                    placeholder=" "
                />
                <label htmlFor="password">New Password</label>
            </div>
            {errors.password && <p className={styles.error}>{errors.password}</p>}

            <div className={errors.passwordConfirm ? styles.inputFieldError : styles.inputField}>
                <input
                    onChange={handleConfirmPasswordChange}
                    name="passwordConfirm"
                    id="passwordConfirm"
                    type="password"
                    placeholder=" "
                    value={confirmPassword}
                />
                <label htmlFor="passwordConfirm">Confirm Password</label>
            </div>
            {errors.passwordConfirm && <p className={styles.error}>{errors.passwordConfirm}</p>}

            <button onClick={saveChanges} className={styles.button}>
                Save Changes
            </button>
        </div>
    ) : null;
}