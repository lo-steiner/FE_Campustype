import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TypingResultAPI from '../../../lib/api/TypingResult';
import UsersAPI from '../../../lib/api/Users';
import { useGlobalContext } from '../../../store'; // Import global context
import { toast, Bounce } from 'react-toastify'; // For user feedback

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const { session, login } = useGlobalContext(); // Access session and login from context
    const [user, setUser] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(''); // For password confirmation

    useEffect(() => {
        if (!id) return;

        const fetchResults = async () => {
            try {
                const data = await TypingResultAPI.getResults(id);
                console.log(data);
                setUser(data[0].user);
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
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const saveChanges = async () => {
        if (user.password && user.password !== confirmPassword) {
            toast.error("Passwords do not match!", { transition: Bounce });
            return;
        }

        const sessionData = JSON.parse(localStorage.getItem("session"));
        const token = sessionData?.accessToken;

        if (!token) {
            toast.error("You need to be logged in to save changes.", { transition: Bounce });
            return;
        }

        try {
            const response = await UsersAPI.update(user, token);
            console.log("Update response:", response);

            // Assuming the backend returns { user, token }
            const { user: updatedUser, token: newToken } = response;

            // Update local state with the returned user data
            setUser(updatedUser);

            // Manually update localStorage with the new token and user data
            const updatedSession = {
                accessToken: newToken,
                username: updatedUser.username,
                email: updatedUser.email,
                userId: updatedUser.id,
            };
            localStorage.setItem("session", JSON.stringify(updatedSession));

            // Update the global context with the new session
            login({ accessToken: newToken });

            toast.success("Profile updated successfully!", { transition: Bounce });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.", { transition: Bounce });
        }
    };

    return user ? (
        <div>
            <input
                onChange={handleChange}
                name="username"
                value={user.username || ''}
                placeholder="Username"
            />
            <input
                onChange={handleChange}
                name="email"
                value={user.email || ''}
                placeholder="Email"
            />
            <input
                onChange={handleChange}
                name="bio"
                value={user.bio || ''}
                placeholder="Bio"
            />
            <input
                onChange={handleChange}
                name="keyboard"
                value={user.keyboard || ''}
                placeholder="Keyboard"
            />
            <input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="New Password"
            />
            <input
                onChange={handleConfirmPasswordChange}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
            />
            <button onClick={saveChanges}>Save Changes</button>
        </div>
    ) : null;
}