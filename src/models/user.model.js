const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
  role: { type: String, default: 'usuario' },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;

