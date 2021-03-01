const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

//POST route for the creation of a new sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//GET route for recovery of sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//GET route for the recovery of a sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//PUT route for the modification of an existing sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//DELETE route for the removal of an existing sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//POST route for adding or removing likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;