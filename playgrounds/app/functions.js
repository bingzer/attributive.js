var fnx = {
    authenticate: function () {
        Attv.Ajax.sendAjax({
            url: app.api + '/account',
            callback: function (wasSuccessful, xhr) {
                if (wasSuccessful) {
                    data.user = JSON.parse(xhr.response);
                    data.user.isAuthorized = true;
    
                    Attv.DataApp.navigate('/');
                } else {
                    Attv.DataApp.navigate('/login');
                }
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

    getTodos: function (fn, context, options) {
        window.setTimeout(function () {
            var url = Attv.Expressions.replaceVar('${app.api}/todos?userId=${user.id}', context);
            Attv.Ajax.sendAjax({
                url: url,
                callback: function (wasSuccessful, xhr) {
                    var data = JSON.parse(xhr.response);
                    fn(data);
                }
            });
        }, 2000);

        return this;
    }
}



// register filters
Attv.Expressions.filters.formatDate = function (date) {
    return new Date(parseInt(date)).toLocaleString()
};
Attv.Expressions.filters.fullname = function (user) {
    return user.firstName + " " + user.lastName;
};

Attv.whenReady(function () {
    fnx.authenticate();
});