import { createStore } from 'vuex'

// Create a new store instance.
export default createStore({
    state () {
        return {
            validationToken : '',
            userId: null,
            userData: null,
            userEventsOrganized: [],
            userEventsAttending: [],
            categories: null
        }
    },
    mutations: {
        setToken (state, token) {
            state.validationToken = token
        },
        setUserId (state, id) {
            state.userId = id
        },
        setUserData (state, data) {
            state.userData = data
        },
        setEventsAttending(state, data) {
            state.userEventsAttending = data
        },
        setEventsOrganized(state, data) {
            state.userEventsOrganized = data
        },
        setCategories(state, data) {
            state.categories = data
        }
    }
})