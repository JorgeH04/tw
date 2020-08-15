const ControladorTweet = require('./tweet');

exports.getHome = (req, res) => {
  if (req.user) {
    ControladorTweet.getTweetsParaUsuarios(req.user.siguiendo)
      .then((tweets) => {
        res.render('home', {tweets});
      })
  } else {
    res.render('home');
  }
}