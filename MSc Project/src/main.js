import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Statistics from './views/Statistics.vue'

const router=createRouter({history:createWebHistory(),
    routes:[{path:'/',component:Dashboard},
            {path:'/statistics',component:Statistics}
    ]
})
router.beforeEach(async(to,from)=>
    {
        if(window.location.pathname === '/login_user/') {
		return true
	}

	const response=await fetch("/api/check_if_authenticated/",{credentials:'include'})
        let authenticated=await response.json()
        console.log(authenticated.authenticated)
        if(authenticated.authenticated==false)
        {
            window.location.href='/login_user/'
            return false

        }
    })
createApp(App).use(router).use(createPinia()).mount('#app')
