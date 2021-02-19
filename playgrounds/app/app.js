var app = {
    name: 'Todo App',

    settings: {
        container: '#main-container',
        lock: false,
        routes: [{
            path: '/',
            url: 'todo.html',
            when: function() { return data.user.isAuthorized; }
        },{
            path: '/login',
            url: 'login.html',
            title: 'Login',
            when: function() { return !data.user.isAuthorized; }
        },{
            path: '/profile',
            url: 'profile.html',
            title: 'Profile',
            when: function() { return data.user.isAuthorized; }
        },{
            path: '/admin',
            url: 'admin.html',
            title: 'Admin',
            when: function() { return data.user.isAdmin; }
        },{
            match: '/users/(.*)',
            url: 'user-detail.html',
            title: 'User Detail',
            getContext: function (match) {
                var email = match.routeContext[1];
                var user = data.users.filter(u => u.email === email)[0];
                return { user };
            },
            when: function() { return data.user.isAdmin; }
        },{
            path: '/about',
            title: 'About',
            url: 'about.html'
        },{
            path: '/logout',
            fn: function () { fn.logout() }
        }]
    }
};