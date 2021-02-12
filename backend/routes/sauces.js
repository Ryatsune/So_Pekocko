const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

//route POST pour la création d'une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//route GET pour la récupération des sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//route GET pour la récupération d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//route PUT pour la modification d'une sauce existante
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//route DELETE pour la suppression d'une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// //route POST pour l'ajout ou suppression de likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;