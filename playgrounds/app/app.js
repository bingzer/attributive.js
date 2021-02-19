var app = {
    name: 'Todo App',

    settings: {
        container: '#main-container',
        routes: [{
            name: '',
            path: '/',
            url: 'todo.html'
        },{
            name: 'login',
            path: '/login',
            url: 'login.html'
        },{
            name: 'profile',
            path: '/profile',
            url: 'profile.html'
        },{
            name: 'about',
            path: '/about',
            url: 'about.html'
        }]
    },


    user: {
        isAuthorized: false
    },
    loginInfo: {
        email: 'john@example.com',
        password: '123'
    },
    users: [{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: '123'
        }, {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            password: '456'
        }
    ],
    newTodo: {
        title: '',
        content: '',
        dateTime: '',
        tags: []
    },
    todos: [

    ],
};