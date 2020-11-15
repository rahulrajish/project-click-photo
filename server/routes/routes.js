const express = require('express');
const router = express.Router();
const controllers = require('./../controller/controller');

router.get('/say-something', controllers.saySomething);

module.exports = router;
