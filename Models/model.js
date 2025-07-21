// models/submission.model.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  codeId: String,
  name: String,
  email: String,
  submissions: Array,
  timestamp: Date,
  forcedFail: Boolean
});

module.exports = mongoose.model('Submission', submissionSchema);
