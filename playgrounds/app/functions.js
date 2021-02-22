var fnx = {
    authenticate: function () {
        Attv.Ajax.sendAjax({
            url: app.api + '/account',
            callback: function (wasSuccessful, xhr) {
                if (!wasSuccessful)
                    return;

                data.user = JSON.parse(xhr.response);
                data.user.isAuthorized = true;

                Attv.DataApp.navigate('/');
            }
        });
    },

    logout: function () {
        Attv.Ajax.sendAjax({
            url: app.api + '/account/logout',
            callback: function (wasSuccessful, xhr) {
                if (!wasSuccessful)
                    return;
                    
                data.user = {
                    isAuthorized: false
                };

                Attv.DataApp.navigate('/login');
            }
        });
    },

    addTodo: function () {
        data.newTodo.dateTime = Date.now();
        data.newTodo.id = Attv.generateId('todo');

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

    findTodo: function (id, email) {
        var user = this.findUser(email);
        for (var i = 0; i < user.todos.length; i++) {
            if (user.todos[i].id === id) {
                return user.todos[i];
            }
        }

        return undefined;
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
Attv.Expressions.filters.formatDate = function (date) {
    return new Date(date).toLocaleString()
};
Attv.Expressions.filters.fullname = function (user) {
    return user.firstName + " " + user.lastName;
};