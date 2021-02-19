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
            path: '/about',
            title: 'About',
            url: 'about.html'
        }]
    }
};