var data = {
    user: {
        isAuthorized: false
    },
    login: {
        email: 'admin@example.com',
        password: '123'
    },
    users: [{
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: '123',
            todos: []
        }, {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            password: '123',
            todos: []
        }, {
            firstName: 'Admin',
            lastName: 'Doe',
            email: 'admin@example.com',
            password: '123',
            isAdmin: true,
            todos: [{
                id: 0,
                title: 'This is the admin',
                content: 'Hello',
                dateTime: Date.now(),
                tags: []
            }]
        }
    ],
    newTodo: {
        id: undefined,
        title: '',
        content: '',
        dateTime: '',
        tags: []
    }
};