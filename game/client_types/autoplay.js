/**
* # Autoplay code
* Copyright(c) 2021 Stefano Balietti
* MIT Licensed
*
* Handles automatic play.
*
* http://www.nodegame.org
*/

const ngc =  require('nodegame-client');

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Retrieve the player client type and rename its nodename property.
    let game = gameRoom.getClientType('player');
    game.nodename = 'autoplay';
    // Create a new stager based on the player client type.
    stager = ngc.getStager(game.plot);

    // Modyfy the new stager's init property, so that at every step
    // it performs an automatic choice, after the PLAYING even is fired.
    let origInit = stager.getOnInit();
    if (origInit) stager.setDefaultProperty('origInit', origInit);
    stager.setOnInit(function() {
        // Call the original init function, if found.
        var origInit = node.game.getProperty('origInit');
        if (origInit) origInit.call(this);

        // Auto play, depedending on the step.
        node.on('PLAYING', function() {
            var id = node.game.getStepId();
            node.timer.setTimeout(function() {
                var res, w;
                
                w = node.widgets.lastAppended;

                // Check if widget requires correct values.
                if (w) {

                    // Do not step if there is an EndScreen.
                    if (w.widgetName === 'EndScreen') return;

                    // Do not step if there is an EndScreen.
                    w.setValues({ correct: true });
                    if (w.widgetName === 'RiskGauge' && w.method === 'Bomb') {
                        // The button isn't immediately enabled.
                        node.timer.setTimeout(function() {
                            w.panelDiv
                                .querySelector('button.btn-danger').click();
                                node.done();
                        }, 100);
                    } 
                }
                
                // Try to step forward.
                res = node.done();
                if (res) return;
                
                // Custom steps.


                // Try to step forward.
                res = node.done();
                if (res) return;
                



            }, 1000);
        });

    });

    game.plot = stager.getState();
    return game;
};
