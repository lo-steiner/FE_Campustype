import {BASE_URL, getJSON} from ".";

const WordsAPI=  {
    getWords() {
        return getJSON(`${BASE_URL}/api/words`)
    }
};

export default WordsAPI;