import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Account from './views/Account.vue'
import Settings from './views/Settings.vue'
import Statistics from './views/Statistics.vue'

const router=createRouter({history:createWebHistory(),
    routes:[{path:'/',component:Dashboard},
            {path:'/account',component:Account},
            {path:'/settings',component:Settings},
            {path:'/statistics',component:Statistics}
    ]
})
router.beforeEach(async(to,from)=>
    {
        const response=await fetch("http://localhost:8000/check_if_authenticated/",{credentials:'include'})
        let authenticated=await response.json()
        console.log(authenticated.authenticated)
        if(authenticated.authenticated==false)
        {
            window.location.href='http://localhost:8000/login_user/'
            return false

        }
    })
createApp(App).use(router).mount('#app')
