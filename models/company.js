const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CompanySchema = new Schema({
    company_name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    work_day: {
        type: Number,
        required: true
    }
});

const test = mongoose.connection.useDb('test');
const company = test.model('company', CompanySchema);

module.exports = company;