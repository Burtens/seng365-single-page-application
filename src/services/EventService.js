import axios from 'axios';
import store from "../plugins/store";

export default class EventService {

    getEvents(startIndex, count, q, selectedCategories, sortBy) {

        let categoryIds = [];

        if (selectedCategories !== null) {
            for (let category in selectedCategories) {
                categoryIds.push(selectedCategories[category].id)
            }
        }

        let params = {
            categoryIds,
            sortBy
        }

        if (q !== '') {
            params["q"] = q
        }

        if (startIndex !== 0) {
            params["startIndex"] = startIndex
            params["count"] = count
        }

        return axios.get('http://localhost:4941/api/v1/events', {params,
            headers: {
                "X-Authorization": store.state.validationToken
            }})
            .then(res => res.data)

    }

    setEventsOrganized() {
        const organizerId = store.state.userId
        axios.get('http://localhost:4941/api/v1/events', {params: {organizerId}})
            .then(res => {
                store.commit('setEventsOrganized', res.data)
            })
    }


    async setEventsAttending() {

        const userId = store.state.userId

        const events = (await axios.get('http://localhost:4941/api/v1/events', {})).data

        let tempEvents = []

        for (let event in events) {
            let attendees = await this.getEventAttendees(events[event].eventId)
            let myAttendance = attendees.find(x => x.attendeeId === userId)
            if (myAttendance) {
                if (myAttendance.status !== 'rejected') {
                    tempEvents.push(events[event])
                }
            }
        }
        store.commit('setEventsAttending', tempEvents)
    }


    getRelatedEvents(categories) {
        return axios.get('http://localhost:4941/api/v1/events', {params: {categoryIds: categories}})
            .then(res => res.data)
    }

    getCategories() {
        return axios.get('http://localhost:4941/api/v1/events/categories')
            .then(res => res.data)
    }

    getEvent(eventId) {
        return axios.get(`http://localhost:4941/api/v1/events/${eventId}`, {
            headers: {
                "X-Authorization": store.state.validationToken
            }}).then(res => res.data)
    }

    getEventAttendees(eventId) {
        return axios.get(`http://localhost:4941/api/v1/events/${eventId}/attendees`, {
            headers: {
                "X-Authorization": store.state.validationToken
            }
        }).then(res => res.data).catch(err => console.log(err))
    }

    requestAttendance(eventId) {
        return axios.post(`http://localhost:4941/api/v1/events/${eventId}/attendees`, {}, {
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }

    removeAttendance(eventId) {
        return axios.delete(`http://localhost:4941/api/v1/events/${eventId}/attendees`, {
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }

    createEvent(event) {
        return axios.post(`http://localhost:4941/api/v1/events/`, event, {
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }

    async setEventImage(userId, image) {
        await axios.put(`http://localhost:4941/api/v1/events/${userId}/image`, image,
            {
                headers: {
                    "X-Authorization": store.state.validationToken,
                    "Content-Type": image.type
                }
            })
    }

    deleteEvent(eventId) {
        return axios.delete(`http://localhost:4941/api/v1/events/${eventId}`, {
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }


    editEvent(eventId, event) {
        return axios.patch(`http://localhost:4941/api/v1/events/${eventId}`, event,{
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }

    setAttendanceStatus(status, eventId, userId) {
        return axios.patch(`http://localhost:4941/api/v1/events/${eventId}/attendees/${userId}`, {status},{
            headers: {
                "X-Authorization": store.state.validationToken
            }
        })
    }

}