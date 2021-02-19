var app = {
    name: 'Todo App',

    settings: {
        container: '#main-container',
        lock: true,
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
            withContext: function (match, fn) {
                var email = match.routeContext[1];
                var user = data.users.filter(u => u.email === email)[0];
                var context = { user };
                fn(context);
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