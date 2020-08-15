const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  email: {type: String, unique: true, lowercase: true, required: true},
  password: {type: String, required: true},
  nombre: {type: String, required: true},
  biografia: {type: String},
  siguiendo: [{type: Schema.Types.ObjectId, ref: 'Usuario'}],
  seguidores: [{type: Schema.Types.ObjectId, ref: 'Usuario'}],
}, {
  timestamps: true
})

usuarioSchema.pre('save', function(next) {
  const usuario = this;
  const usuarioId = usuario._id;

  if (usuario.siguiendo.indexOf(usuarioId) === -1) {
    usuario.siguiendo.push(usuarioId);
    usuario.seguidores.push(usuarioId); // REFILM
  }

  if (!usuario.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }
    bcrypt.hash(usuario.password, salt, null, (err, hash) => {
      if (err) {
        next(err);
      }
      usuario.password = hash;
      next();
    })
  })
})

usuarioSchema.methods.compararPassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, sonIguales) => {
    if(err) {
      return cb(err);
    }
    cb(null, sonIguales);
  })
}

usuarioSchema.methods.avatar = function(dimension=55) {
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://api.adorable.io/avatars/${dimension}/${md5}`;
}

module.exports = mongoose.model('Usuario', usuarioSchema);