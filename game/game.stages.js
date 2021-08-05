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
        .stage('effort')
        .stage('instructions')
        .stage('survey')
          .step('q1')
          .step('q2')
          .step('q3')
          .step('q4')
          .step('q5')
          .step('q6')
          .step('q7')
          .step('q8')
          .step('q9')
          .step('q10')
          .step('q11')
          .step('q12')
          .step('q13')
          .step('q14')
          .step('q15')
          .step('q16')
          .step('q17')
          .step('q18')
          .step('q19')
          .step('q20')
          .step('q21')
          .step('q22')
          .step('q23')
          .step('q24')
          .step('q25')
          // .step('q26')
          // .step('q27')
          // .step('q28')
          // .step('q29')

        .stage('feedback')

        .stage('end')

        .gameover();


    // Modify the stager to skip one stage.
    // stager.skip('survey');

    // To skip a step within a stage use:
    //stager.skip('instructions');
    // Notice: here all stages have just one step.
};
