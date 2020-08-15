const Tweet = require('../modelos/Tweet');

exports.postTweet = (req, res) => {
  const texto = req.body.texto;

  if (!texto) {
    req.flash('errores', {mensaje: 'No se te olvide escribir tu tweet'});
    return res.redirect('/');
  }

  const tweet = new Tweet({
    texto,
    usuario: req.user._id
  });

  tweet.save()
    .then(() => {
      res.redirect('/')
    });
}

exports.getTweetsParaUsuarios = (usuarioIds) => {
  return Tweet
    .find({usuario: {$in: usuarioIds}})
    .sort({createdAt: -1})
    .populate('usuario');
}