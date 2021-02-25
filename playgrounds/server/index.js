const data = {
    users: [{
            id: '9UD2GYc',
            firstName: 'Admin',
            lastName: 'Doe',
            email: 'admin@example.com',
            password: '123',
            isAdmin: true
        },{
            id: '3SyjMjL',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: '123'
        }, {
            id: 'eVo6RmH',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            password: '123'
        },
    ],
    todos: [{
        id: '1Yjcyzk',
        title: 'This is the admin',
        content: 'Hello',
        dateTime: Date.now(),
        userId: '9UD2GYc',
        tags: []
    }],
    words: [{
        id: 'donec',
        name: 'Donec',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius purus in lectus ornare, vitae laoreet odio vehicula. Fusce ut tincidunt odio'
    },{
        id: 'ultricies',
        name: 'Ultricies',
        content: 'Nunc sollicitudin accumsan nibh hendrerit viverra. Praesent et lacinia metus, semper iaculis enim. Etiam laoreet commodo tellus nec commodo.'
    }]
};

module.exports = () => {
    return data;
}