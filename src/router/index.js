import { createRouter, createWebHistory } from 'vue-router'
import VueRouteMiddleware from 'vue-route-middleware';
import auth from '../middleware/auth.js';
import guest from "@/middleware/guest";

/** Routes **/
  /** Auth **/
    import Login from '../views/Login.vue'
    import Register from '../views/Register.vue'
    import Logout from '../views/Logout.vue'
  /** End Auth **/

    import Index from '../views/Index.vue'
    import NotFoundView from '../views/NotFoundView.vue'
    import Dashboard from '../views/Dashboard.vue'
    import Calendar from '../views/Calendar.vue'

  /** Directory **/
    import Directory from '../views/Directory/Layout.vue'
    import Directory_index from '../views/Directory/Index.vue'
    import Directory_Fields from '../views/Directory/Fields.vue'
  /** End Directory **/

  /** New **/
    import NewField from '../views/New/Field.vue'
  /** End New **/

  /** Edit **/
    import EditField from '../views/Edit/Field.vue'
  /** End edit **/
/** End routes **/


const routes = [
  { path: '/', name: 'index', component: Index, meta: { middleware: guest } },
  { path: '/login', name: 'login', component: Login, meta: { middleware: guest }, },
  { path: '/register', name: 'register', component: Register, meta: { middleware: guest }, },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { middleware: auth }, },
  { path: '/directory', name: 'directory', component: Directory, meta: { middleware: auth }, children: [
      { path: '', component: Directory_index, name: 'directory.index' },
      { path: 'fields', component: Directory_Fields, name: 'directory.fields' }
    ]
  },
  { path: '/new', name: 'new', meta: { middleware: auth }, children: [
      { path: '', component: NotFoundView, name: 'newError' },
      { path: 'field', component: NewField, name: 'new.field' }
    ]
  },
  { path: '/edit', name: 'edit', meta: { middleware: auth }, children: [
      { path: '', component: NotFoundView, name: 'editError' },
      { path: 'field/:id', component: EditField, name: 'edit.field' }
    ]
  },
  { path: '/calendar', name: 'calendar', component: Calendar, meta: { middleware: auth }, },

  // Not found 404
  { path: '/:pathMatch(.*)*', component: NotFoundView },

  // Logout
  { path: '/logout', component: Logout }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(VueRouteMiddleware());


export default router
