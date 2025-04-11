import {BASE_URL, deleteJSON, getJSON, postJSON, putJSON} from ".";

const UsersAPI=  {
    login(user) {
        return postJSON(`${BASE_URL}/api/auth/login`, {body: user})
    },
    register(user) {
        return postJSON(`${BASE_URL}/api/auth/register`, {body: user})
    },
    update(user, token) {
        const id = user.id
        return putJSON(`${BASE_URL}/api/users/${id}`, {body: user, token: token})
    },
    getUser(id) {
        return getJSON(`${BASE_URL}/api/users/${id}`)
    },
    deleteUser(id) {
        return deleteJSON(`${BASE_URL}/api/users/${id}`)
    }
};

export default UsersAPI;