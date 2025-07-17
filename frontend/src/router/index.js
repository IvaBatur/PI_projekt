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
    path: '/coach/gallery',
    name: 'CoachGallery',
    component: () => import('../views/common/GalleryView.vue'),
    meta: { requiresAuth: true, role: 'coach' }
  },
  {
    path: '/member/gallery',
    name: 'MemberGallery',
    component: () => import('../views/common/GalleryView.vue'),
    meta: { requiresAuth: true, role: 'member' }
  },
  {
    path: '/guest/gallery',
    name: 'GuestGallery',
    component: () => import('../views/common/GalleryView.vue')
  },
  {
    path: '/:role/notices/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/common/NoticeDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/tournaments',
    name: 'Tournaments',
  component: () => import('../views/common/TournamentsView.vue')
},
{
  path: '/coach/tournaments',
  name: 'CoachTournaments',
  component: () => import('../views/common/TournamentsView.vue'),
  meta: { requiresAuth: true, role: 'coach' }
},
{
  path: '/member/tournaments',
  name: 'MemberTournaments',
  component: () => import('../views/common/TournamentsView.vue'),
  meta: { requiresAuth: true, role: 'member' }
},
{
  path: '/guest/tournaments',
  name: 'GuestTournaments',
  component: () => import('../views/common/TournamentsView.vue')
},
{
  path: '/coach/tournaments/create',
  name: 'CreateTournament',
  component: () => import('../views/coach/CreateTournament.vue'),
  meta: { requiresAuth: true, role: 'coach' }
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
  {
  path: '/coach/treneri',
  name: 'Coach',
  component: () => import('@/views/coach/CoachView.vue')
},
{

  path: '/member/treneri',
  name: 'Coach',
  component: () => import('@/views/coach/CoachView.vue')
},
{

  path: '/guest/treneri',
  name: 'Coach',
  component: () => import('@/views/coach/CoachView.vue')
},


  next()
})
export default router
