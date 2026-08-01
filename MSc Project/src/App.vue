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
                const response=await fetch("/api/logout_user/",
                {method:'POST',credentials:'include',headers:{'X-CSRFToken': await this.getCsrfCookie()}})
                if(response.ok)
                {
                    window.location.href='/'
                }
            }
        }
    }
</script>
<template>
    <body>
        <div id="header">
            <nav class="navbar navbar-expand-md" style="background-color: #1d2d44;">
                <div class="container-fluid">
                    <a class="navbar-brand text-light">Focus Tracker</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#mainRouterNav" aria-controls="mainRouterNav" aria-expanded="false"
                            aria-label="Toggle navigation bar">
                            <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse d-flex justify-content-end" id="mainRouterNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <router-link class="nav-link text-light" to="/">Command Centre</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link text-light" to="/statistics">Statistics</router-link>
                            </li>
                            <li class="nav-item">
                                <button id="navButton" class="btn text-light" style="background-color: #0d1321;" @click="callToLogout">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <router-view class="min-vh-100 p-3" style="background-color: #f1f4f9;" />
        </div>
    </body>
</template>