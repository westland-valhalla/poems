const yaml = require('js-yaml');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

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

try {

  const poem = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'poem.yaml'), 'utf8'));

  let md = `# ${poem.info.title} by ${poem.info.author}\n\n`;

  poem.page.forEach(a => {

    // ignore page header
    a.section.forEach(b => {

      md = md + '\n';
      b.line.forEach(section => {

        console.log('yy', section)
        md = md + section + '\n\n';

      });

    });

  });

  mkdirp.sync( path.join(__dirname, 'dist') );
  fs.writeFileSync(path.join(__dirname, 'dist', 'POEM.md'), md)

  const source = fs.readFileSync( path.join(__dirname, 'src', 'index.html'), 'utf8')
  const template = hbs.compile(source);
  const html = template(poem);

  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html)

  console.log(md);
} catch (e) {
  console.log(e);
}
