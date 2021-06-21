const dutyList = `
  <start> 2021-03-01 00:00:00
  
  马志勇
  刘沈
  冯绍辉
  荆佳慧
  相莹
  李歌
  蔡新宇
  张爽
  杨兰
`;

function getCurrentDate() {
  return new Date(Date.now() + 1000 * 60 * 60 * 8);
}

function getDutyInfo(file) {
  let [start, ...duty] = dutyList.split('\n').map(n => n.trim()).filter(n => n.trim().length);
  start = new Date(start.replace(/<\w+>/, '').trim());
  return { start, duty };
}

function getPersonByDate(date) {
  let { start, duty } = getDutyInfo();
  if (start > date) {
    return 'No duty.';
  }
  let weeks = ~~((date - start) / (7 * 24 * 60 * 60 * 1000));
  return duty[weeks % duty.length];
}

function whoisonduty(options = {}) {
  let person = getPersonByDate(getCurrentDate());
  if (options.list) {
    let { duty } = getDutyInfo();
    let personList = duty
      .map(n => ((n === person) ? '> ' : '  ') + n)
      .join('\n');
    return personList;
  } else {
    return person;
  }
}
module.exports = whoisonduty;