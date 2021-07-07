const path = require('path');
const fs = require('fs')
const NDDB = require('NDDB');
const J    = require('JSUS').JSUS;

// Data directory.
const DATADIR = path.resolve('..', 'data');

// Output directory.
const OUTDIR = path.resolve('..', 'data_export'); // path.resolve('..', 'data');



// Array of files that will be loaded (if found).
const FILES = [
    'bonus_prolific.csv',
    'bonus.csv',
    'memory.json',
    'memory.csv',
    'data.json',
    'data.csv',
    'times.csv',
    'times_json',
    'player_data.csv',
    'player_data.json'
];

// Limit to room numbers.

const minRoom = null;
const maxRoom = null;

const dirFilter = (dir) => {

    // Filter room number.
    if (minRoom || maxRoom) {
        let roomNum = dir.split('room')[1];
        roomNum = J.isInt(roomNum);
        if (roomNum) {
            if (minRoom && roomNum < minRoom) return false;
            if (maxRoom && roomNum > maxRoom) return false;
        }
    }
    return true;
}

// Load all files.

let checkUnique = {};

if (!fs.existsSync(OUTDIR)) {
    fs.mkdirSync(OUTDIR);
    console.log('- created ' + OUTDIR);
}

// Create dir name based on time.
let t = new Date().toISOString().replaceAll(':', '-').replace('T', '_');
t = t.substr(0, t.lastIndexOf('.'));

let OUTDIR_EXPORT = path.join(OUTDIR, t);
if (!fs.existsSync(OUTDIR_EXPORT)) {
    fs.mkdirSync(OUTDIR_EXPORT);
    console.log('- created ' + OUTDIR_EXPORT);
}

FILES.forEach(file => {
    
    if (checkUnique[file]) {
        console.log(`- skipping duplicated file: ${file}`);
        return;
    }

    checkUnique[file] = true;

    let db = new NDDB();    
    console.log('- loading: ' + file);


    // Load files.
    let opts = {
        recursive: true,
        filter: file,
        dirFilter: dirFilter,
        
        // Alternative filters:
        // filter: file => file === 'bonus_prolific.csv',
        // format: 'csv',
    };
    if (file === 'bonus_prolific.csv') opts.header = false;
    db.loadSyncAll(DATADIR, opts);

    // Check size.
    console.log('  found: ' + db.size());
    if (!db.size()) return;

    // Save out file.
    opts = {};
    if (file === 'bonus_prolific.csv') {
        opts = {
            header: false,
            quote: ""
        };
    }
    db.save(path.resolve(OUTDIR_EXPORT, file), opts);
});




//db.log(db => db.first())




