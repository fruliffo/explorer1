const path = require('path');
const fs = require('fs')
const NDDB = require('NDDB');
const J    = require('JSUS').JSUS;

// Data directory.
const DATADIR = path.resolve('..', 'data');

// Output directory.
const OUTDIR = path.resolve('..', 'data_export'); // path.resolve('..', 'data');


let db = new NDDB();

let ROOM = 'room000032';

db.loadSync(path.join(DATADIR, ROOM, 'memory.json'));

let table = db.table('player');
console.log(table);
