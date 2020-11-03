#!/usr/bin/env node --no-warnings

/*jshint esversion:8*/

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const WEEK = 7 * 24 * 60 * 60 * 1000;
let today = createDate();

function help() {
    console.log(`
Usage:
  whoisonduty [date] [options]

Date:
  Date is optional, please separate multiple dates with spaces, and you can use 'today' for today which is default as well.

Options:
  --list or -l: Output as a list, and you can specify a start date if you like.
  --help or -h: Print help info.
  `);
}

function createDate(dateString, message = '\nInvalid Date') {
    if (dateString) {
        let date = new Date(dateString);
        if (date == 'Invalid Date') {
            return message;
        } else {
            return date;
        }
    } else {
        return new Date();
    }
}

function getDutyInfo(file) {
    let content = '';
    try {
        content = fs.readFileSync(path.join(__dirname, 'duty'), 'utf8');
    } catch (e) {
        throw new Error("Can't read duty info.");
    }
    let [start, ...duty] = content.split('\n').filter(n => n.trim().length);
    start = start.replace(/<\w+>/, '').trim();
    start = createDate(start, 'Invalid start date in duty info');
    return { start, duty };
}

function getWeeks(start, date) {
    return ~~((date - start) / WEEK);
}

function getPersonByDate(date) {
    let { start, duty } = getDutyInfo();
    if (start > date) {
        return 'No duty.';
    } else {
        return duty[getWeeks(start, date) % duty.length].trim();
    }
}

function getArgs() {
    let input = process.argv.slice(2);
    return {
        inputDate: input.filter(n => !n.startsWith('--') && !n.startsWith('-')),
        inputOption: input.find(n => n.startsWith('--') || n.startsWith('-'))
    };
}

function highlight(s, color = '\033[1m') {
    return color + s + '\033[0m';
}

function formateDate(date) {
    return date.toLocaleString('zh', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
    //.replace(/(?<!,) /g, '-');
}
let { inputDate, inputOption } = getArgs();

if (!inputOption) {
    if (inputDate.length < 1) {
        inputDate = ['today'];
    }
    console.log(
        inputDate.map(inputDate => {
            let isToday = inputDate == 'today';
            let date = isToday ? today :
                createDate(inputDate, `Invalid date: '${inputDate}'`);
            if (typeof(date) == 'string') {
                return date;
            } else {
                let person = getPersonByDate(date);
                let output = `${formateDate(date)}. ${person}`;
                return isToday ? highlight(output) : output;
            }
        }).join('\n')
    );
} else if (inputOption == '--list' || inputOption == '-l') {
    let { start, duty } = getDutyInfo();
    if (inputDate.length > 0) {
        todayBak = today;
        today = createDate(inputDate);
        if (typeof(today) == 'string' || today < start) {
            console.log('Invalid start date, so today’s list will be shown.');
            today = todayBak;
        }
    }
    let thisWeek = getWeeks(start, today);
    let thisWeekBegin = start.getTime() + thisWeek * WEEK;
    let personOnDuty = getPersonByDate(today);
    let total = duty.length;
    let hr = '——————————————————————————————————————————————————';
    let HR = '－－－－－－－－－－－－－－－－－－－－－－－－－';
    let tab = '\t\b\b\b\b\b';
    let personList = duty.map((v, i) => {
            let person = v.trim();
            let afterWeeks = (i + total - thisWeek % total) % total;
            let nextWeekBegin = createDate(thisWeekBegin + afterWeeks * WEEK);
            let nextWeekEnd = createDate(thisWeekBegin + (afterWeeks + 1) * WEEK - 1);
            let nextWeek = formateDate(nextWeekBegin) + ' ~ ' + formateDate(nextWeekEnd);
            if (person === personOnDuty) {
                return `|> ${highlight(person)}  ${tab}|  ${highlight(nextWeek)}  |`;
            } else {
                return `|  ${person}  ${tab}|  ${nextWeek}  |`;
            }
        })
        .join(`\n${hr}\n`);
    console.log(
        [
            HR,
            `|  值日生  ${tab}|            下次值日日期             |`,
            HR,
            `${personList}`,
            HR
        ]
        .join('\n')
    );
} else if (inputOption == '--help' || inputOption == '-h') {
    help();
} else {
    console.log(`Invalid option: '${inputOption}'`);
    help();
}