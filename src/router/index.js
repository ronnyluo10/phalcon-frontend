import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PatientView from '../views/PatientView.vue';
import PatientForm from '../views/Partials/PatientForm.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/patients',
      name: 'patient',
      component: PatientView
    },
    {
      path: '/patient/create',
      name: 'patient-create',
      component: PatientForm
    },
    {
      path: '/patient/edit/:id',
      name: 'patient-edit',
      component: PatientForm,
    }
  ]
})

export default router
