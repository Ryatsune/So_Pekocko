const express = require('express');
const router = express.Router();
const bouncer = require('express-bouncer')();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;