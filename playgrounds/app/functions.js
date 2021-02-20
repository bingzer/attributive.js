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
    }
}



// register filters
Attv.Binders.filters.formatDate = (date) => {
    return new Date(date).toLocaleString()
};