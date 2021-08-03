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

        // Email.
        memory.view('email').save('email.csv', {
            header: [ 'timestamp', 'player', 'email' ],
            keepUpdated: true
        });

        // memory.sync();

        memory.on('insert', item => {
            if (item.forms) {
                for (let f in item.forms) {
                    if (item.forms.hasOwnProperty(f)) {
                        item[f] = item.forms[f];
                        delete item[f].id;
                        delete item[f].isCorrect;
                    }
                }
                delete item.forms;
            }
        });


        // NEW VERSION
        // node.on.done('q25', function(msg) {
        // END NEW VERSION

        // OLD VERSION.
        node.on.data('done', function(msg) {

            if (!node.game.isStage('feedback', msg.stage)) return;
            // END OLD VERSION

            let id = msg.from;

            // Saves bonus file, and notifies player.
            gameRoom.computeBonus({
                append: true,
                clients: [ id ],
                amt: true,
                headerAdd: [ 'ip', 'userAgent' ],
                showBonus: false
            });

            let db = memory.player[id];

            // db.save('data.csv', {
            //     header: 'all',
            //     append: true,
            //     objectLevel: 3,
            //     flatten: true,
            //     adapter: {
            //         isCorrect: false,
            //         id: false,
            //         order: false,
            //         group: false,
            //         done: false,
            //         timeup: false,
            //         stageId: false,
            //         stepId: false,
            //         'stage.stage': false,
            //         'stage.step': false,
            //         'stage.round': false,
            //         'order.0': false,
            //         'order.1': false,
            //         'order.2': false,
            //         'order.3': false,
            //         'order.4': false,
            //         'order.5': false,
            //         'order.6': false,
            //         'order.7': false
            //     }
            // });

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
