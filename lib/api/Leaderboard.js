import {BASE_URL, getJSON} from ".";

const LeaderboardAPI=  {
    getUsers(words, timestamp) {
        if (timestamp) {
            const url = `${BASE_URL}/api/leaderboard?timestamp=${timestamp}`;
            return getJSON(`${url}&_sort=-wpm`)
        } else if(words){
            const url = `${BASE_URL}/api/leaderboard?words=${words}`;
            return getJSON(`${url}&_sort=-wpm`)
        } else {
            const url = `${BASE_URL}/api/leaderboard?`;
            return getJSON(`${url}_sort=-wpm`)
        }
    },
};

export default LeaderboardAPI;