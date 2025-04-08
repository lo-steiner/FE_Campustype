import {BASE_URL, postJSON} from ".";

const TypingResultAPI = {
    saveResult(result, token) {
        return postJSON(`${BASE_URL}/api/results`, {body: result, token: token});
    },
};

export default TypingResultAPI;