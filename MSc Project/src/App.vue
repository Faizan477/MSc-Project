<script>
    export default
    {
        data()
        {
            return{}
        },
        methods:
        {
            async getCsrfCookie()
            {
                let csrfCookie=await cookieStore.get('csrftoken')
                console.log(csrfCookie.value.length)
                return csrfCookie.value
            },
            async callToLogout()
            {
                const response=await fetch("http://localhost:8000/logout_user/",
                {method:'POST',credentials:'include',headers:{'X-CSRFToken': await this.getCsrfCookie()}})
                if(response.ok)
                {
                    window.location.href='http://localhost:8000/'
                }
            }
        }
    }
</script>
<template>
    <body>
        <div id="header">
            <nav class="navbar navbar-expand-md navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand">Focus Tracker</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#mainRouterNav" aria-controls="mainRouterNav" aria-expanded="false"
                            aria-label="Toggle navigation bar">
                            <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse d-flex justify-content-end" id="mainRouterNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/">Command Centre</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/account">Account</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/settings">Settings</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/statistics">Statistics</router-link>
                            </li>
                            <li class="nav-item">
                                <button class="btn btn-light" @click="callToLogout">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <router-view class="bg-dark text-light vh-100 p-3" />
        </div>
    </body>
</template>