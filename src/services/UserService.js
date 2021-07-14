import axios from 'axios'
import store from "../plugins/store";


export default class UserService {


    async login(email, password) {
        await axios.post('http://localhost:4941/api/v1/users/login',
            {email: email, password: password}).then(res => {
            store.commit('setToken', res.data.token)
            store.commit('setUserId', res.data.userId)
            })
    }

    async logout() {
        await axios.post('http://localhost:4941/api/v1/users/logout', {},
            {headers: {
                    "X-Authorization": store.state.validationToken
                }})
    }

    async signUp(firstname, lastname, email, password) {
        await axios.post('http://localhost:4941/api/v1/users/register', {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password
        })
    }

    async getUser(userId) {
        return await axios.get(`http://localhost:4941/api/v1/users/${userId}`,{headers: {
                "X-Authorization": store.state.validationToken
            }})
            .then(res => res.data).catch(err => console.log(err))
    }


    async updateDetails(newData, userId) {
        await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, newData, {
            headers: {
                "X-Authorization": store.state.validationToken,}
        })
    }

    async getImage(userId) {
        return await axios.get(`http://localhost:4941/api/v1/users/${userId}/image`)
            .then(res => res.data).catch(err => console.log(err))
    }


    async setImage(image, userId) {
        await axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image,
            {
                headers: {
                    "X-Authorization": store.state.validationToken,
                    "Content-Type": image.type
                }
            })
    }

    async deleteImage(userId) {
        await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`,
            {
                headers: {
                    "X-Authorization": store.state.validationToken,
                }
            })

    }

}