exports.getLoginPage = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split('=')[1] === 'true';
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedin = true;
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
};

exports.postLogout = (req, res) => {
    req.session.destroy(() => res.redirect('/'));
}