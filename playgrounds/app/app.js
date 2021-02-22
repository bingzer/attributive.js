/**
 * This the SPA app
 */
var app = {
    name: 'Todo App',
    container: '#main-container',
    lock: true,
    api: 'http://localhost:3000',
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
        withContext: function (match, fn) {
            fn({ user: data.user });
        },
        when: function() { return data.user.isAuthorized; }
    },{
        path: '/admin',
        url: 'admin/index.html',
        title: 'Admin',
        when: function() { return data.user.isAdmin; },
    },{
        match: '/users/(.*)/todos/(.*)',
        url: 'partials/todo-detail.html',
        title: 'Todo Detail',
        withContext: function (match, fn) {
            var email = match.routeContext[1];
            var todoId = match.routeContext[2];

            var user = fnx.findUser(email);
            var todo = fnx.findTodo(todoId, email);

            fn({ user: user, todo: todo });
        },
        when: function() { return data.user.isAdmin; }
    },{
        match: '/users/(.*)',
        url: 'admin/user-detail.html',
        title: 'User Detail',
        withContext: function (match, fn) {
            var email = match.routeContext[1];
            var user = fnx.findUser(email);
            
            fn({ user: user });
        },
        when: function() { return data.user.isAdmin; }
    },{
        path: '/about',
        title: 'About',
        url: 'partials/about.html'
    },{
        path: '/logout',
        fn: function () { fnx.logout() }
    }]
};