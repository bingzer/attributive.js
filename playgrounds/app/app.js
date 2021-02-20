/**
 * This the SPA app
 */
var app = {
    name: 'Todo App',
    container: '#main-container',
    lock: true,
    routes: [{
        path: '/',
        url: 'partials/todo.html',
        when: function() { return data.user.isAuthorized; }
    },{
        path: '/login',
        url: 'partials/login.html',
        title: 'Login',
        when: function() { return !data.user.isAuthorized; }
    },{
        path: '/profile',
        url: 'partials/profile.html',
        title: 'Profile',
        when: function() { return data.user.isAuthorized; }
    },{
        path: '/admin',
        url: 'partials/admin.html',
        title: 'Admin',
        when: function() { return data.user.isAdmin; }
    },{
        match: '/users/(.*)',
        url: 'partials/user-detail.html',
        title: 'User Detail',
        withContext: function (match, fn) {
            var email = match.routeContext[1];
            var user = data.users.filter(u => u.email === email)[0];
            var context = { user };
            fn(context);
        },
        when: function() { return data.user.isAdmin; }
    },{
        match: '/users/(.*)/todos/(.*)',
        url: 'partials/todo-detail.html',
        title: 'Todo Detail',
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
        url: 'partials/about.html'
    },{
        path: '/logout',
        fn: function () { fn.logout() }
    }]
};