const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    lastname : {type:String, required : true},
    firstname : {type:String, required : true},
    email : {type:String, required : true},
    rdv_date : {type:Date, required : true},
    rdv_heure : {type:String, required : true},

});

module.exports = mongoose.model('Model', ModelSchema);