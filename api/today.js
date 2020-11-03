const dutyList = `
  <start> 2020-03-30 00:00:00
  冯绍辉
  荆佳慧
  相莹
  李歌
  杨兰
  马志勇
  刘沈
  唐尧
`;

function getCurrentDate() {
  return new Date(Date.now() + 1000 * 60 * 60 * 8);
}

function getDutyInfo(file) {
  let [start, ...duty] = dutyList.split('\n').map(n => n.trim()).filter(n => n.trim().length);
  start = new Date(start.replace(/<\w+>/, '').trim());
  return {start, duty};
}

function getPersonByDate(date) {
  let {start, duty} = getDutyInfo();
  if (start > date) {
    return 'No duty.';
  }
  let weeks = ~~((date - start) / (7 * 24 * 60 * 60 * 1000));
  return duty[weeks % duty.length];
}

function whoisonduty(options = {}) {
  let person = getPersonByDate(getCurrentDate());
  if (options.list) {
    let {duty} = getDutyInfo();
    let personList = duty
      .map(n => ((n === person) ? '> ' : '  ') + n)
      .join('\n');
    return personList;
  } else {
    return person;
  }
}


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
