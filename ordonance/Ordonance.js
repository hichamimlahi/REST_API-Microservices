const mongoose = require("mongoose");
const OrdonanceSchema = mongoose.Schema({
    medicaments: {
        type: [String]
    },
    email_patient: String,
    prix_total: Number,
    created_at: {
        type: Date,
        default: Date.now,
    },
});
module.exports = Ordonance = mongoose.model("ordonance", OrdonanceSchema);