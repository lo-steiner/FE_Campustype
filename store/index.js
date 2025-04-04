import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens
import { createContext, useContext, useEffect, useState } from "react"; // React hooks and context

const STORAGE_KEY = "session"; // Key for localStorage

// Hook to manage session state
const useSession = () => {
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [session, setSession] = useState(null); // Holds session data

    const login = (_session) => { // Logs in user
        setSession(_session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_session)); // Save to localStorage
    };

    const logout = () => { // Logs out user
        setSession(null);
        localStorage.removeItem(STORAGE_KEY); // Clear from localStorage
    };

    useEffect(() => { // Runs on mount to check session
        if (!window) return; // Skip in server-side rendering
        const session = JSON.parse(localStorage.getItem(STORAGE_KEY)); // Get stored session

        if (session) {
            const { exp } = jwtDecode(session.accessToken); // Get token expiration
            const expiryDate = new Date(0); // Create date from epoch
            expiryDate.setUTCSeconds(exp); // Set expiration time
            if (new Date() >= expiryDate) { // Check if expired
                console.log("jwt expired");
                logout();
                return;
            }
            login(session); // Log in if valid
        }
        setLoading(false); // Done loading
    }, []); // Empty array = run once

    return { session, login, logout, loading }; // Expose session state and methods
};

// Context for global session state
const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext); // Hook to access context

// Provider component to share session state
const GlobalContextProvider = ({ children }) => {
    const state = useSession(); // Get session state
    return (
        <GlobalContext.Provider value={state}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider; // Export provider