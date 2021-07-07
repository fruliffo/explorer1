/**
* # Logic type implementation of the game stages
* Copyright(c) 2021 Anca <anca.balietti@gmail.com>
* MIT Licensed
*
* http://www.nodegame.org
* ---
*/

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    let node = gameRoom.node;
    let channel = gameRoom.channel;
    let memory = node.game.memory;

    // Make the logic independent from players position in the game.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Must implement the stages here.

    stager.setOnInit(function() {

        // Feedback.
        memory.view('feedback').save('feedback.csv', {
            header: [ 'time', 'timestamp', 'player', 'feedback' ],
            keepUpdated: true
        });

        // Email.
        memory.view('email').save('email.csv', {
            header: [ 'timestamp', 'player', 'email' ],
            keepUpdated: true
        });

        memory.sync();

        node.on.done('end', function(msg) {
            let id = msg.from;

            // Saves bonus file, and notifies player.
            gameRoom.computeBonus({
                append: true,
                clients: [ id ],
                amt: true
            });

            let db = memory.player[id];

            db.save('data.csv', { header: 'all', append: true });

            // Select all 'done' items and save its time.
            db.select('done').save('times.csv', {
                header: [
                    'session', 'player', 'stage', 'step', 'round',
                    'time', 'timeup'
                ],
                append: true
            });
        });
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
