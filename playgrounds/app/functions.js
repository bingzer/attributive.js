var fn = {
    login: function () {
        data.login.result = 'Username/Password does not match';

        var authenticatedUser = data.users.filter(u => (u.password === data.login.password && u.email.equalsIgnoreCase(data.login.email)))[0];

        if (authenticatedUser) {
            data.user = authenticatedUser;
            data.user.isAuthorized = !!authenticatedUser;
            Attv.DataApp.navigate('/');

            data.login.result = undefined;
        } else {
            data.user = { isAuthorized: false };
        }
        
        Attv.loadElements(undefined, { forceReload: true });

        return !!authenticatedUser;
    },

    logout: function () {
        data.user = {
            isAuthorized: false
        };

        Attv.DataApp.navigate('/login');
    },

    addTodo: function () {
        data.newTodo.dateTime = Date.now();
        data.newTodo.id = data.user.todos.length;

        data.user.todos.push(data.newTodo);
        data.newTodo = {
            id: undefined,
            title: '',
            content: '',
            dateTime: undefined,
            tags: []
        };
        
        Attv.loadElements(undefined, { forceReload: true });
    },

    deleteTodo: function (id) {
        data.user.todos.splice(id, 1);
        
        Attv.loadElements(undefined, { forceReload: true });
    },

    formatDate: function (date) {
        return new Date(date).toLocaleString();
    },

    formatEmail: function (email) {
        return '<a href="mailto:' + email + '">' + email + '</a>';
    },

    formatDeleteUser: function (user) {
        return '<button type="button" class="btn btn-danger" onclick="fn.deleteUser(\'' + user.email +'\')" data-wall="confirm" data-content="Are you sure you want to delete ' + user.email + '?">Delete</button>' +
        '&nbsp;<a href="#/users/' + user.email + '" class="btn btn-secondary">Edit</a>';
    },

    formatDeleteTodo: function (todo) {
        return '<button type="button" class="btn btn-danger" onclick="fn.deleteTodo(\'' + todo.id +'\')" data-wall="confirm" data-content="Are you sure you want to delete ' + todo.title + '?">Delete</button>';
    }
}
