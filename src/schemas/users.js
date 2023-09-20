const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
//const autopopulate = require('mongoose-autopopulate');

const usersSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    lastname: {type: String, required: true, minlength: 2},
    email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/], required: true, index: {unique: true}},
    username: {type: String, lowercase: true, match: /^[a-zA-Z0-9_]+$/, required: true, minlength: 3, index: {unique: true}},
    password: {type: String, required: true, minlength: 6, select: false},
    admin: Boolean,
    active: {type: Boolean, default: true},
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blogs'/* , autopopulate: true  */}]
    }, {timestamps: true}
);
//usersSchema.plugin(autopopulate);
usersSchema.pre('save', async function(next) {
    try {
        let user = this;
    //evita que se vuelva a hashear la contraseña cada vez que se actualiza el usuario
        if(!user.isModified('password')) return next();
        const salt = await bcrypt.genSalt(parseInt(config.SALT));
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }    
});

usersSchema.statics.findByCredentials = async function (username, password) {
    const user = await this.findOne({username}).select('_id username password admin');
    if (!user) {
        throw new Error("No autorizadou.");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("No autorizadop.")
    }
    return user;
}

usersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
}
const userModel = mongoose.model('Users', usersSchema);

module.exports =  userModel;