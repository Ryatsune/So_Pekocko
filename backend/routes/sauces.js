const express = require('express');

//création d'un routeur avec express
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');

//route GET pour la récupération des sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//route GET pour la récupération d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//route POST pour la création d'une nouvelle sauce
router.post('/', auth, sauceCtrl.createSauce);
//route PUT pour la modification d'une sauce existante
router.put('/:id', auth, sauceCtrl.modifySauce);
//route DELETE pour la suppression d'une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// //route POST pour l'ajout ou suppression de likes
router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;