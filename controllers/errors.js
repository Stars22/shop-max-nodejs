const get404Page = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found', path: null, isAuthenticated: req.session.isLoggedin});
};

module.exports = { get404Page };