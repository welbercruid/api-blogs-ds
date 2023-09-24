const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const usersSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2},
    lastname: {type: String, required: true, minlength: 2},
    email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/], required: true, index: {unique: true}},
    username: {type: String, lowercase: true, match: /^[a-zA-Z0-9_]+$/, required: true, minlength: 3, index: {unique: true}},
    password: {type: String, required: true, minlength: 6, select: false},
    admin: Boolean,
    active: {type: Boolean, default: true},
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blogs'}]
    }, {timestamps: true}
);

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
    const user = await this.findOne({username}).select('+password')//('_id username password admin active');
    if (!user) {
        throw new Error("No autorizadou.");
    }
    // if (user.active === false) {
    //     throw new Error("Cuenta bloqueada!");
    // }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("No autorizadop.")
    }
    return user;
}

usersSchema.statics.searchMailAdmin = async function() {
    const elAdmin = await this.findOne({admin : true}).select('email');
    if (elAdmin) {
        return elAdmin.email;
    } else {
        return null;
    }
}

usersSchema.statics.searchStateUser = async function(id) {
    const user = await this.findOne({ _id: id, active: false }).select('active');
    if (user) {
        return user.active
        //throw new Error("Cuenta bloqueadaaaaaaa!");
    }
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