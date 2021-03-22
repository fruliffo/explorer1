/**
 * # Game stages definition file
 * Copyright(c) 2021 Anca <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .stage('instructions')

        .stage('survey')
          .step('q1')
          .step('q2')
          .step('q3')
          .step('q4')

        .repeat('game', settings.ROUNDS)
           .step('guess')
           .step('results')

        .stage('end')

        .gameover();

    // Modify the stager to skip one stage.
    // stager.skip('instructions');

    // To skip a step within a stage use:
    stager.skip('instructions');
    stager.skip('game');
    // Notice: here all stages have just one step.
};
