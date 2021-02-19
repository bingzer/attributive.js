var fn = {
    login: function () {
        for (var i = 0; i < data.users.length; i++) {
            var u = data.users[i];
            if (u.password === data.loginInfo.password && u.email === data.loginInfo.email) {
                data.user = u;
                data.user.isAuthorized = true;

                break;
            }
        }

        Attv.DataApp.navigate('/');

        return false;
    },

    logout: function () {
        data.user = {
            isAuthorized: false
        };

        Attv.DataApp.navigate('/login');
    },

    addTodo: function () {
        data.newTodo.dateTime = Date.now();
        data.newTodo.id = data.todos.length;

        data.todos.push(data.newTodo);
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
        data.todos.splice(id, 1);
        
        Attv.loadElements(undefined, { forceReload: true });
    },

    formatDate: function (date) {
        return new Date(date).toLocaleString();
    },

    formatEmail: function (email) {
        return '<a href="mailto:' + email + '">' + email + '</a>';
    },

    formatDeleteUser: function (user) {
        return '<button type="button" class="btn btn-danger" onclick="fn.deleteUser(\'' + user.email +'\')" data-wall="confirm" data-content="Are you sure you want to delete ' + user.email + '?">Delete</a>';
    },

    formatDeleteTodo: function (todo) {
        return '<button type="button" class="btn btn-danger" onclick="fn.deleteTodo(\'' + todo.id +'\')" data-wall="confirm" data-content="Are you sure you want to delete ' + todo.title + '?">Delete</a>';
    }
}
