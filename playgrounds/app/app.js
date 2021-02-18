var app = {
    name: 'Todo App',
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
    todos: [

    ],

    login: function () {
        for (var i = 0; i < app.users.length; i++) {
            var u = app.users[i];
            if (u.password === app.loginInfo.password && u.email === app.loginInfo.email) {
                app.user = u;
                app.user.isAuthorized = true;

                Attv.loadElements(undefined, { forceReload: true });
                return true;
            }
        }

        return false;
    },
    logout: function () {
        app.user = {
            isAuthorized: false
        };
        
        Attv.loadElements(undefined, { forceReload: true });
    }
};