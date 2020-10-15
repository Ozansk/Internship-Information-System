const mongoose = require('mongoose');
const User = require('./User');
const company = require('./company');
var Schema = mongoose.Schema;

const StudentSchema = new Schema({
    email: {
        type: String,
    },
    companies: [{
        type: Schema.Types.ObjectId,
        ref: 'company'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const student_page = mongoose.connection.useDb('test');
const User_page = student_page.model('User_page', StudentSchema);

module.exports = User_page;