var mongoose=require('mongoose');
var booksSchema=require('../schemas/books');
module.exports=mongoose.model('book',booksSchema);