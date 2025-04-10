import {BASE_URL, postJSON, getJSON} from ".";


const TypingResultAPI = {
    saveResult(result, token) {
        console.log("token", token)
        return postJSON(`${BASE_URL}/api/results`, {body: result, token: token});
    },
 
    getResults(id) {
        return getJSON(`${BASE_URL}/api/results/${id}`);
    },

    getRun(id)  {
        return getJSON(`${BASE_URL}/api/run/${id}`);
    }
};

export default TypingResultAPI;