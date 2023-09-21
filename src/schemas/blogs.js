const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema({
    active: {type: Boolean, default: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: String,//{/* secure_url: String, public_id: String,  */type: String,required: true}, //String,
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