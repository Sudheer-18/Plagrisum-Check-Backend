const Code = require('../Models/model');
const { identifierSimilarity } = require('../utils/tokenutils');
const { logicSimilarity } = require('../utils/logicfingerprint');

const K_GRAM = 5;
const WINDOW = 4;
const ID_THRESHOLD = 0.4;
const LOG_THRESHOLD = 0.3;

exports.checkPlagiarism = async (req, res) => {
  try {
    const { code1, code2 } = req.body;

    const idSim = identifierSimilarity(code1, code2);
    const logSim = logicSimilarity(code1, code2, K_GRAM, WINDOW);
    const avgSim = (idSim + logSim) / 2;
    const plagiarism = idSim >= ID_THRESHOLD && logSim >= LOG_THRESHOLD;

    res.json({ identifierSimilarity: idSim, logicSimilarity: logSim, averageSimilarity: avgSim, plagiarism });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAllPlagiarism = async (req, res) => {
  try {
    const codes = await Code.find({});
    console.log(codes);

    let result = [];
    const emailMap = {};

    for (let i = 0; i < codes.length; i++) {
      for (let j = i + 1; j < codes.length; j++) {

        if (codes[i].codeId !== codes[j].codeId) continue;

        const idSim = identifierSimilarity(codes[i].code, codes[j].code);
        const logSim = logicSimilarity(codes[i].code, codes[j].code, K_GRAM, WINDOW);
        const isPlag = idSim >= ID_THRESHOLD && logSim >= LOG_THRESHOLD;

        if (isPlag) {
          if (!emailMap[codes[i].email]) {
            emailMap[codes[i].email] = {
              codeId: codes[i].codeId,
              name: codes[i].name,
              email: codes[i].email,
              plagiarisedWith: []
            };
          }

          if (!emailMap[codes[j].email]) {
            emailMap[codes[j].email] = {
              codeId: codes[j].codeId,
              name: codes[j].name,
              email: codes[j].email,
              plagiarisedWith: []
            };
          }

          emailMap[codes[i].email].plagiarisedWith.push({
            codeId: codes[j].codeId,
            name: codes[j].name,
            email: codes[j].email
          });

          emailMap[codes[j].email].plagiarisedWith.push({
            codeId: codes[i].codeId,
            name: codes[i].name,
            email: codes[i].email
          });
        }
      }
    }

    result = Object.values(emailMap);
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
