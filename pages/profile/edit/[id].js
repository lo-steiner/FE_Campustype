import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TypingResultAPI from '../../../lib/api/TypingResult';
import UsersAPI from '../../../lib/api/Users';
import Link from 'next/Link';

export default function ProfilePage() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState(null);

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

    const saveChanges = () => {
        const session = JSON.parse(localStorage.getItem("session"))
        const token = session.accessToken
        console.log(token)
        UsersAPI.update(user, token)
    }

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
            <input type="password" placeholder="Confirm Password" />
            <button onClick={saveChanges}>save changes</button>
        </div>
    ) : null;
}