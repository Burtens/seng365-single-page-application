import {createRouter, createWebHistory} from "vue-router";
import store from "./store"

// Pages
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Search from "../pages/Search";
import Profile from "../pages/Profile";
import Events from "../pages/Events";

// Routes
const routes = [
    {
        path: '/', redirect: '/login',
    },
    {
        path: '/login',
        component: Login,
        meta: { mustBeLoggedOut: true }
    },
    {
        path: '/register',
        component: Register,
        meta: { mustBeLoggedOut: true }
    },
    {
        path: '/home',
        component: Home,
        children : [
            {
                path: '',
                component: Search
            },
            {
                path: 'profile',
                component: Profile,
                meta: { requiresAuth: true }
            },
            {
                path: 'events',
                component: Events,
                meta: { requiresAuth: true }
            }
        ]

    }
];

// Export router so that it can be used
export const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    // Routes that can only be accessed if the user is logged in
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.validationToken) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    // Routes that can only be access if the user is logged out
    } else if (to.matched.some(record => record.meta.mustBeLoggedOut)) {
        if (store.state.validationToken) {
            next({
                path: '/home',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})



