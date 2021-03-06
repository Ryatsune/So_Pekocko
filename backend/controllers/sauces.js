const Sauce = require('../models/Sauce');
const fs = require('fs');
//mongo sanitize empêche d'entrer le caractère '$' dans l'input 
const sanitize = require('mongo-sanitize');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject.userId);
    const cleanSauceObject = {
      name: sanitize(sauceObject.name),
      manufacturer: sanitize(sauceObject.manufacturer),
      description: sanitize(sauceObject.description),
      heat: sanitize(sauceObject.heat),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      mainPepper: sanitize(sauceObject.mainPepper),
      userId: sanitize(sauceObject.userId),
      likes:0,
      dislikes:0,
      usersLiked: [],
      usersDisliked: [],
    }
    console.log(cleanSauceObject);
    const sauce = new Sauce({
       ...cleanSauceObject,
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    //req.file evalue si une nouvelle image est ajoutée si oui new imageUrl, si non ...req.body
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res) => {
    switch (req.body.like) {
      case 0:
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            if (sauce.usersLiked.find((user) => user === req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              })
                .then(() => { res.status(201).json({ message: 'Like retiré !' }); })
                .catch((error) => { res.status(400).json({ error }); });
            } if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                //the $inc operator increments a field by a specified value
                //the $pull operator removes from an existing array all instances of a value or values that match a specified condition
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              })
                .then(() => { res.status(201).json({ message: 'Dislike retiré !' }); })
                .catch((error) => { res.status(400).json({ error }); });
            }
          })
          .catch((error) => { res.status(404).json({ error }); });
        break;
      case 1:
        Sauce.updateOne({ _id: req.params.id }, {
          //the $push operator appends a specified value to an array
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        })
          .then(() => { res.status(201).json({ message: 'Like ajouté !' }); })
          .catch((error) => { res.status(400).json({ error }); });
        break;
      case -1:
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        })
          .then(() => { res.status(201).json({ message: 'Dislike ajouté !' }); })
          .catch((error) => { res.status(400).json({ error }); });
        break;
      default:
        console.error( error );
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
}