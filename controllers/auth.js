exports.getLoginPage = (req, res, next) => {
    const isAuthenticated = req.get('Cookie').split('=')[1]
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
};