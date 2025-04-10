import {BASE_URL, getJSON, postJSON} from ".";

const TypingResultAPI = {
    startTest(wordCount, token) {
        return postJSON(`${BASE_URL}/api/start-test?wordCount=${wordCount}`, {
            token: token
        });
    },

    saveResult(result, token, testToken) {
        return postJSON(`${BASE_URL}/api/results`, {
            body: result,
            token: token,
            headers: {
                "Content-Type": "application/json",
                "Test-Token": testToken
            }
        });
    },

    getResults(id) {
        return getJSON(`${BASE_URL}/api/results/${id}`);
    },

    getRun(id) {
        return getJSON(`${BASE_URL}/api/run/${id}`);
    }
};

export default TypingResultAPI;