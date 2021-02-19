const whoisonduty = require('./whoisonduty.js');

module.exports = (req, res) => {
  let list = false;
  if (req.body && req.body.text) {
    list = (req.body.text.trim() == '--list');
  }
  res.status(200).json({
    "response_type": "in_channel",
    "text": whoisonduty({ list })
  });
}
