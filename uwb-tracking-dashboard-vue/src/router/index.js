import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../main.js'; 
import RegisterPage from '../views/RegisterPage.vue';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true } 
  },
  
  {
    path: '/:catchAll(.*)', 
    redirect: to => {
      if (auth.currentUser) {
        return { name: 'Dashboard' };
      } else {
        return { name: 'Login' };
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  await new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
    });
  });

  if (requiresAuth && !currentUser) {
    next({ name: 'Login' });
  } else if ((to.name === 'Login' || to.name === 'Register') && currentUser) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
