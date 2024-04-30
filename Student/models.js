const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema(
    {
        name: String,
        roll_no: Number,
        wad_marks: Number,
        cc_marks: Number,
        dsbda_marks: Number,
        cns_marks: Number
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Student", StudentSchema)