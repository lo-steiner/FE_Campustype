import {BASE_URL, getJSON} from ".";

const LeaderboardAPI=  {
    getUsers() {
        const url = `${BASE_URL}/api/leaderboard`;
        return getJSON(`${url}?_sort=-wpm`)
    }
};

export default LeaderboardAPI;