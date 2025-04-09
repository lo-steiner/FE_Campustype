import {BASE_URL, getJSON, postJSON} from ".";

const TypingResultAPI = {
    saveResult(result, token) {
        return postJSON(`${BASE_URL}/api/results`, {body: result, token: token});
    },
    getRun(id)  {
        return getJSON(`${BASE_URL}/api/run/${id}`);
    }
};

export default TypingResultAPI;