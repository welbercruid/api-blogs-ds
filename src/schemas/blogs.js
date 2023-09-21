const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    active: {type: Boolean, default: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: { 
        public_id: String, //id de donde está guardada la imagen
        secure_url: String}, //su link        
    author: String, 
    username: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    }, {timestamps: true}
);

const blogsModel = mongoose.model('Blogs', blogsSchema);

//todos los posts con información del usuario que lo publicó
// blogsModel.find().populate('postedBy').exec(function(err, blogs) {
//     console.log(blogs);
// })
module.exports = blogsModel;