#!/usr/bin/env node

/**
 * Module dependencies.
 */

const fs = require('fs');
const path = require('path');
const main = require('./index.js');

const yaml = require('js-yaml');

const program = require('commander');

program
  .version('0.1.0')

  .command('compile <poem> [poems...]', {isDefault: true})
  .action(function (...actionArguments) {

    // map input to a persistent object
    let poems = actionArguments
    .slice(0,actionArguments.length-1)
    .map(file=>path.resolve(file))
    .filter(file=>fs.existsSync(file))
    .map(file=>({ file, data:fs.readFileSync(file).toString() }))

    // hydration
    poems.filter( file => path.extname(file.file) === '.json' ) .map(file => { file.data = JSON.parse(file.data) } )
    poems.filter( file => path.extname(file.file) === '.yaml' ) .map(file => { file.data = yaml.safeLoad(file.data) } )

    poems = poems.map( object => object.data );

    // format check
    poems = poems
    .filter( poem => poem.meta )
    .filter( poem => poem.meta.title )
    .filter( poem => poem.data )

    if(poems.length) main({poems})

    if(poems.length === 0) console.log(`Did not find any comptible poems.`)

  });

  program.parse(process.argv);
