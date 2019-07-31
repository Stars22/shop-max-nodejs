exports.getLoginPage = (req, res, next) => {
    // const isAuthenticated = req.get('Cookie').split('=')[1] === 'true';
    console.log(req.session);
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