const Usuario = require('../modelos/Usuario');

exports.getExplorar = (req, res) => {
  res.render('explorar', {usuarios: []});
}

exports.postExplorar = (req, res) => {
  const query = req.body.query;

  Usuario.find({nombre: new RegExp(`.*${query}.*`, 'i')})
    .select('_id nombre biografia email')
    .then((usuarios) => {
      res.render('explorar', {usuarios});
    })
}