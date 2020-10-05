const rb = require('request-promise');

const cheerio = require('cheerio');

const Table = require('cli-table');

let users = [];
let table = new Table({
  head: ['username', '<3', 'challenges'],
  colWidths: [15, 5, 1],
});
const options = {
  url:
    'https://forum.freecodecamp.org/directory_items?period=weekly&order=likes_received',
  json: true,
};

rb(options)
  .then((data) => {
    let userData = [];
    for (let user of data.directory_items) {
      userData.push({
        name: user.user.username,
        likes_received: user.likes_received,
      });
    }
    process.stdout.write('loading');

    getChallenges(userData);
  })
  .catch((err) => console.log('eroor'));

function getChallenges(userData) {
  var i = 0;
  function next() {
    if (i < userData.length) {
      var options = {
        url: `https://www.freecodecamp.org/u/` + userData[i].name,
        transform: (body) => cheerio.load(body),
      };
      rb(options)
        .then(function ($) {
          process.stdout.write(`.`);
          const fccAccount = $('h1.landing-heading').length == 0;
          console.log(fccAccount);
          const challengesPassed = fccAccount
            ? $('tbody tr').length
            : 'unknown';
          table.push([
            userData[i].name,
            userData[i].likes_received,
            challengesPassed,
          ]);
          ++i;
          return next();
        })
        .catch((err) => console.log('bad'));
    } else {
      printData();
    }
  }
  return next();
}

function printData() {
  console.log('collected ');
  console.log(table.toString());
}
