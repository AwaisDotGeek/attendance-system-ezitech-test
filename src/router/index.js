import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import LoginPage from '../components/auth/LoginPage.vue';
import SignupPage from '../components/auth/SignupPage.vue';
import UserPanel from '../components/user_pages/UserPanel';
import AdminPanel from '../components/admin_pages/AdminPanel';

const routes = [
    { path: '/', component: WelcomePage },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/user-panel', component: UserPanel },
    { path: '/admin-panel', component: AdminPanel }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;