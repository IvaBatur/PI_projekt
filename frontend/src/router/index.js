import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'HomeStart',
    component: () => import('../views/HomeStart.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/coach/members',
    name: 'CoachMembers',
    component: () => import('../views/coach/MembersView.vue'),
    meta: { requiresAuth: true, role: 'coach' }
  },
  {
    path: '/coach/notices',
    name: 'CoachNotices',
    component: () => import('../views/NoticesView.vue'),
    meta: { requiresAuth: true, role: 'coach' }
  },
  {
    path: '/member/notices',
    name: 'MemberNotices',
    component: () => import('../views/NoticesView.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/guest/notices',
    name: 'GuestNotices',
    component: () => import('../views/NoticesView.vue')
  },
  {
    path: '/coach/about',
    name: 'CoachAbout',
    component: () => import('../views/common/AboutView.vue'),
    meta: { requiresAuth: true, role: 'coach' }
  },
  {
    path: '/member/about',
    name: 'MemberAbout',
    component: () => import('../views/common/AboutView.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/guest/about',
    name: 'GuestAbout',
    component: () => import('../views/common/AboutView.vue')
  },
  {
    path: '/:role/notices/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/common/NoticeDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']
  const userRole = store.getters['auth/userRole']

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/')
  }

  if (to.meta.role && userRole !== to.meta.role) {
    return next('/home')
  }

  next()
})

export default router
