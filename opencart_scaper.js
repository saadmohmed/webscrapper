//author saad mohmed

const rb = require('request-promise');

const cheerio = require('cheerio');

const Table = require('cli-table');

let users = [];
let table = new Table({
  head: ['name', 'price'],
  colWidths: [30, 30],
});

var options = {
  url: `https://caja.store/`,
  transform: (body) => cheerio.load(body),
};
rb(options)
  .then(function ($) {
    process.stdout.write('loading ');
    var i = 0;
    $('.caption > h4 > a').each(function () {
      process.stdout.write(`.`);

      table.push([$(this).html().trim(), $('.price').eq(i).html().trim()]);
      i++;
    });
  })
  .then(() => {
    printData();
  })
  .catch((err) => console.log(err));

function printData() {
  console.log('collected ');
  console.log(table.toString());
}
