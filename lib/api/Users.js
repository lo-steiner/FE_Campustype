import {BASE_URL, postJSON} from ".";

const UsersAPI=  {
    login(user) {
        return postJSON(`${BASE_URL}/api/auth/login`, {body: user})
    },
    register(user) {
        return postJSON(`${BASE_URL}/api/auth/register`, {body: user})
    },
};

export default UsersAPI;