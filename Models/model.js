const mongoose = require('mongoose');

const CodeSubmissionSchema = new mongoose.Schema({
  codeId: { type: String, required: true },
  name: String,
  email: String,
  code: String,
  language: String,
  timestamp: Date,
}, { collection: 'submissions' }); 

module.exports = mongoose.models.CodeSubmission ||
  mongoose.model('CodeSubmission', CodeSubmissionSchema);
