const get404Page = (req, res, next) => {
    res.status(404).render('404', { 
        pageTitle: 'Page not found',
        path: null,
        isAuthenticated: req.session.isLoggedin});
};

const get500Page = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Something went wrong',
        path: null,
        isAuthenticated: req.session.isLoggedin});
};


module.exports = { get404Page, get500Page };