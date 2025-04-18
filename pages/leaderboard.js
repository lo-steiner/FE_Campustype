import Leaderboard from '../components/Leaderboard/Leaderboard.jsx';
import LeaderboardAPI from "../lib/api/Leaderboard.js";

export default function LeaderboardPage({ users }) {
    return <Leaderboard users={users} />;
}

export async function getStaticProps() {
    const getUsers = await LeaderboardAPI.getUsers(10);
    return {
        props: {
            users: getUsers || [],
        },
        revalidate: 10,
    };
}