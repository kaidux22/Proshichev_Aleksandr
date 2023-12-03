import { createRouter, createWebHashHistory } from "vue-router";

import TheUsers from '@/components/TheUsers.vue'
import TheAdmin from '@/components/TheAdmin.vue'
import TheEmpty from '@/components/TheEmpty.vue'
import TheUser from '@/components/TheUser.vue'

const routes = [
    { path: '/', name : 'home', component : TheEmpty},
    { path: '/users', name : 'users', component : TheUsers},
    { path: '/admin', name : 'admin', component : TheAdmin},
    { path: '/user/:id', name : 'user', component : TheUser }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router