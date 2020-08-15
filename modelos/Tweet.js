const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  texto: String,
  usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
}, {
  timestamps: true
});

module.exports = mongoose.model('Tweet', tweetSchema);