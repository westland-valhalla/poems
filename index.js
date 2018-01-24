#!/usr/bin/env node

/**
 * Module dependencies.
 */

 const fs = require('fs');
 const kebabCase = require('lodash/kebabCase');

const yaml = require('js-yaml');
const path = require('path');
const mkdirp = require('mkdirp');



// console.log('you ordered a pizza with:');
// if (program.peppers) console.log('  - peppers');
// if (program.pineapple) console.log('  - pineapple');
// if (program.bbqSauce) console.log('  - bbq');
// console.log('  - %s cheese', program.cheese);


const hbs = require('handlebars');

hbs.registerHelper('each', function(context, options) {
  var ret = "";
  //if(context){
  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(Object.assign(context[i], {index:i, number:i+1, numbers:context.length, position:(i+1)} ));
  //}
  }
  return ret;
});

hbs.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper('price', function(amount) {
  return setup.currencySymbol + (parseInt(amount)/100).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + " " + setup.currency;
});

function main({poems}){

  mkdirp.sync( path.join(__dirname, 'dist') );
  mkdirp.sync( path.join(__dirname, 'dist/poems-md') );
  mkdirp.sync( path.join(__dirname, 'dist/poems-txt') );



  let md = `# Poems\n\n`;
  poems.forEach(poem=>{

    md = md + `## ${poem.meta.title} (${poem.meta.year}) by ${poem.meta.author}\n\n`;
    poem.data.forEach(poem => {
      poem.page.forEach(page => {
        md = md + '\n';
        page.section.forEach(line => {
          md = md + line + '\n\n';
        });
      });
    });
    md = md + '\n';
  });
  fs.writeFileSync(path.join(__dirname, 'dist', 'POEMS.md'), md)

  poems.forEach(poem=>{


    let md = ``;
    md = md + `# ${poem.meta.title}\n\n`;

    poem.data.forEach(poem => {
      poem.page.forEach(page => {
        md = md + '\n';
        page.section.forEach(line => {
          md = md + line + '\n\n';
        });
      });
    });
    md = md + '\n';
    md = md + '----\n\n\n';
    md = md + `Written in ${poem.meta.year} by ${poem.meta.author}\n\n`;
    md = md + `${poem.meta.who||""}\n\n`;

    fs.writeFileSync(path.join(__dirname, 'dist/poems-md', kebabCase(poem.meta.title)+'.md'), md)
  });

  poems.forEach(poem=>{


    let md = ``;
    md = md + `${poem.meta.title}\n`;

    poem.data.forEach(poem => {
      poem.page.forEach(page => {
        md = md + '\n';
        page.section.forEach(line => {
          md = md + line + '\n';
        });
      });
    });
    md = md + '\n';
    md = md + '----\n';
    md = md + `Written in ${poem.meta.year} by ${poem.meta.author}\n`;
    md = md + `${poem.meta.who||""}\n`;

    fs.writeFileSync(path.join(__dirname, 'dist/poems-txt', kebabCase(poem.meta.title)+'.txt'), md)
  });


  const source = fs.readFileSync( path.join(__dirname, 'src', 'index.html'), 'utf8')
  const template = hbs.compile(source);
  const html = template({poems});
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html)

}

module.exports = main;
