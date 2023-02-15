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
    import Search from '../views/Search.vue'
    const Calendar = () => import('../views/Calendar.vue')

  /** Directory **/
    import Directory from '../views/Directory/Layout.vue'
    import Directory_index from '../views/Directory/Index.vue'
    import Directory_Fields from '../views/Directory/Fields.vue'
  /** End Directory **/

  /** Directory **/
    import Data from '../views/Data/Layout.vue'
    import Data_index from '../views/Data/Index.vue'
  /** End Directory **/

  /** New **/
    import NewField from '../views/New/Field.vue'
    import NewDirectory from '../views/New/Directory.vue'
  /** End New **/

  /** Edit **/
    import EditField from '../views/Edit/Field.vue'
    import EditDirectory from '../views/Edit/Directory.vue'
    import EditDataDirectory from '../views/Edit/DataDirectory.vue'
  /** End edit **/

  /** Show **/
    import ShowDataDirectory from '../views/Show/DataDirectory.vue'
  /** End show **/

  /** Task **/
    import PublicTask from '../views/PublicTask.vue'
  /** End task **/
/** End routes **/


const routes = [
  // Public routes
  { path: '/', name: 'index', component: Index, meta: { middleware: guest } },
  { path: '/login', name: 'login', component: Login, meta: { middleware: guest }, },
  { path: '/opgave/:token', name: 'publicTask', component: PublicTask },

  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { middleware: auth }, },
  { path: '/search', name: 'search', component: Search, meta: { middleware: auth }, },
  { path: '/directory', name: 'directory', component: Directory, meta: { middleware: auth }, children: [
      { path: '', component: Directory_index, name: 'directory.index' },
      { path: 'fields', component: Directory_Fields, name: 'directory.fields' }
    ]
  },
  { path: '/data', name: 'data', component: Data, meta: { middleware: auth }, children: [
      { path: '', component: Data_index, name: 'data.index' },
    ]
  },
  { path: '/new', name: 'new', meta: { middleware: auth }, children: [
      { path: '', component: NotFoundView, name: 'newError' },
      { path: 'field', component: NewField, name: 'new.field' },
      { path: 'directory', component: NewDirectory, name: 'new.directory' }
    ]
  },
  { path: '/edit', name: 'edit', meta: { middleware: auth }, children: [
      { path: '', component: NotFoundView, name: 'editError' },
      { path: 'field/:id', component: EditField, name: 'edit.field' },
      { path: 'directory/:id', component: EditDirectory, name: 'edit.directory' },
      { path: 'directory/data/:id', component: EditDataDirectory, name: 'edit.data.directory' }
    ]
  },
  { path: '/show', name: 'show', meta: { middleware: auth }, children: [
      { path: '', component: NotFoundView, name: 'editError' },
      { path: 'directory/data/:id', component: ShowDataDirectory, name: 'show.data.directory' },
    ]
  },
  { path: '/calendar', name: 'calendar', component: Calendar, meta: { middleware: auth }, },
  // Logout
  { path: '/logout', component: Logout, meta: { middleware: auth } },

  // Not found 404
  { path: '/:pathMatch(.*)*', component: NotFoundView },

]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(VueRouteMiddleware());


export default router
