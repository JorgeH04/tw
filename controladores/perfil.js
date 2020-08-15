const Usuario = require('../modelos/Usuario');
const ControladorTweet = require('./tweet');

exports.getMiPerfil = (req, res) => {
  getInformacionPerfil(req.user._id)
    .then(([usuario, tweets]) => {
      res.render('perfil', {
        usuario,
        tweets,
        estaSiendoSeguido: false,
        esconderBotones: true
      })
    })
}

exports.getPerfil = (req, res) => {
  const usuarioId = req.params.id;
  const estaSiendoSeguido = req.user ? req.user.siguiendo.indexOf(usuarioId) > -1 : false;
  const esconderBotones = req.user ? false : true;

  if (req.user && req.user._id.equals(usuarioId)) {
    return res.redirect('/mi/perfil');
  }

  getInformacionPerfil(usuarioId)
    .then(([usuario, tweets]) => {
      res.render('perfil', {
        usuario,
        tweets,
        estaSiendoSeguido,
        esconderBotones
      })
    })
}

const getInformacionPerfil = (usuarioId) => {
  return Promise.all([
    Usuario.findOne({_id: usuarioId}),
    ControladorTweet.getTweetsParaUsuarios([usuarioId])
  ]);
}

exports.seguir = (req, res) => {
  const usuarioLogueadoId = req.user._id;
  const usuarioId = req.params.id;

  Promise.all([
    agregarSiguiendo(usuarioLogueadoId, usuarioId),
    agregarSeguidor(usuarioLogueadoId, usuarioId)
  ]).then(() => {
    res.redirect(`/perfil/${usuarioId}`);
  })
}

exports.unseguir = (req, res) => {
  const usuarioLogueadoId = req.user._id;
  const usuarioId = req.params.id;

  Promise.all([
    eliminarSiguiendo(usuarioLogueadoId, usuarioId),
    eliminarSeguidor(usuarioLogueadoId, usuarioId)
  ]).then(() => {
    res.redirect(`/perfil/${usuarioId}`);
  })
}

const agregarSiguiendo = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioLogueadoId},
    {$push: {siguiendo: usuarioId}}
  );
}

const agregarSeguidor = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioId},
    {$push: {seguidores: usuarioLogueadoId}}
  );
}

const eliminarSiguiendo = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioLogueadoId},
    {$pull: {siguiendo: usuarioId}}
  );
}

const eliminarSeguidor = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioId},
    {$pull: {seguidores: usuarioLogueadoId}}
  );
}