const get404Page = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found', path: null});
};

module.exports = { get404Page };