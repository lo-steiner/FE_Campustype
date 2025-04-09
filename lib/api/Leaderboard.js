import {BASE_URL, getJSON} from ".";

const LeaderboardAPI=  {
    getUsers(words) {
        if(words){
            const url = `${BASE_URL}/api/leaderboard?words=${words}`;
            return getJSON(`${url}&_sort=-wpm`)
        } else {
            const url = `${BASE_URL}/api/leaderboard?`;
            return getJSON(`${url}_sort=-wpm`)
        }
    },
};

export default LeaderboardAPI;