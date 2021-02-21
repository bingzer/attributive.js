var fnx = {
    login: function () {
        data.login.result = 'Username/Password does not match';

        var authenticatedUser = fnx.findUser(data.login.email, data.login.password);

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
        data.newTodo.id = Attv.generateElementId('todo');

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

    deleteTodo: function (id, email) {
        var user = this.findUser(email);
        user.todos.splice(id, 1);
        
        Attv.DataApp.refresh();
    },

    findUser: function (email, password) {
        for (var i = 0; i < data.users.length; i++) {
            if (data.users[i].email.equalsIgnoreCase(email)) {
                if (password && data.users[i].password !== password)
                    continue;

                return data.users[i];
            }
        }

        return undefined;
    }
}



// register filters
Attv.Binders.filters.formatDate = function (date) {
    return new Date(date).toLocaleString()
};
Attv.Binders.filters.fullname = function (user) {
    return user.firstName + " " + user.lastName;
};