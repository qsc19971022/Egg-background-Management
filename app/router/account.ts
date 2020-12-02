module.exports = (app) => {
    app.router.get('/', app.controller.home.index);
    app.router.post('/register',app.controller.user.create);
    app.router.post('/login',app.controller.user.index);
    app.router.get('/github',app.controller.github.getLogin);
    app.router.get('/github/callback',app.controller.github.getToken);
};