var app;

app.fn = {};

(function (fn) {
    fn.login = function () {
        for (var i = 0; i < app.users.length; i++) {
            var u = app.users[i];
            if (u.password === app.loginInfo.password && u.email === app.loginInfo.email) {
                app.user = u;
                app.user.isAuthorized = true;

                break;
            }
        }

        Attv.DataApp.navigate('/');

        return false;
    };
    
    fn.logout = function () {
        app.user = {
            isAuthorized: false
        };

        Attv.DataApp.navigate('/login');
    },
    
    fn.addTodo = function () {
        app.newTodo.dateTime = Date.now();

        app.todos.push(app.newTodo);
        app.newTodo = {
            title: '',
            content: '',
            dateTime: undefined,
            tags: []
        };
        
        Attv.loadElements(undefined, { forceReload: true });
    }
})(app.fn);