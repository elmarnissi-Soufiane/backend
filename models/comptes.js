const mongoose = require('mongoose');
const compteSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true

        },
        email: {
            type: String,
            require: true
        },
        password:{
            type: String,
            require: true
        },
        created: {
            type: Date,
            require: true,
            default: Date.now

        },
    }
);

module.exports = mongoose.model('Compte', compteSchema);
