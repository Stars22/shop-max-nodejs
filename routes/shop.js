const express = require('express');

const router = express.Router();

router.use('/', (req, res, next) => {
    res.send('Hello world');
});

module.exports = router;