/**
* # Player type implementation of the game stages
* Copyright(c) 2021 Anca <anca.balietti@gmail.com>
* MIT Licensed
*
* Each client type must extend / implement the stages defined in `game.stages`.
* Upon connection each client is assigned a client type and it is automatically
* setup with it.
*
* http://www.nodegame.org
* ---
*/

"use strict";

const ngc = require('nodegame-client');

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visuaStage = node.widgets.append('VisualStage', header);
        this.visualRound = node.widgets.append('VisualRound', header);

        this.doneButton = node.widgets.append('DoneButton', header, {
            text: 'Next'
        });

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',
        cb: function() {
            var s;
            // Note: we need to specify node.game.settings,
            // and not simply settings, because this code is
            // executed on the client.
            s = node.game.settings;
            // Replace variables in the instructions.
            W.setInnerHTML('coins', s.COINS);
            W.setInnerHTML('rounds', s.ROUNDS);
            W.setInnerHTML('exchange-rate', (s.COINS * s.EXCHANGE_RATE));
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // START OF THE SURVEY
    //////////////////////////////////////////////////////////////////////////
    // Page 1: Age and gender
    stager.extendStep('q1', {
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
            '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { ' +
            'font-weight: normal; padding-left: 10px; }');

            // More space between the text of the question and the choices.
            W.cssRule('.choicetable-maintext { display: block; ' +
            'margin-bottom: 30px !important; }');


            // More space between the text of the question and the choices.
            W.cssRule('dt.question { ' +
            'margin-top: 100px !important; }');

            // More space between the text of the question and the choices.
            W.cssRule('dt.question:first-of-type { ' +
            'margin-top: 20px !important; }');

            // Speaces between choices.
            W.cssRule('table.choicetable { ' +
            'border-collapse: separate; border-spacing: 5px }');

            // Rounded borders.
            W.cssRule('table.choicetable td { ' +
            'border-radius: 5px; }');

        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q1',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'age',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+', 'Prefer not to disclose'],
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: [ 'Female', 'Male', 'Other', 'Prefer not to disclose' ],
                        requiredChoice: true
                    }
                ],
                // Settings here apply to all forms.
                formsOptions: {
                    shuffleChoices: false
                }
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 2. Urban or rural
    stager.extendStep('q2', {
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
            '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q2',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'UrbRur',
                        orientation: 'V',
                        mainText: 'Do you live in an urban or a rural area?',
                        choices: [ 'Rural', 'Urban'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. Urban or rural
    stager.extendStep('q4', {
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
            '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q4',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'EnvVsGrowth',
                        orientation: 'V',
                        mainText: 'Which languages do you feel most comfortable to answer a HIT in?',
                        // hint: 'Choose max two:',
                        choices: [ 'Assamese','Bengali','Bodo','Dogri','English',
                        'Gujarati','Hindi','Kannada','Kashmiri','Konkani',
                        'Maithili','Malayalam','Marathi','Meitei','Nepali',
                        'Odia','Punjabi','Sanskrit','Santali','Sindhi','Tamil',
                        'Telugu','Urdu'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. Environment vs growth
    stager.extendStep('q4', {
        cb: function() {
            // Modify CSS rules on the fly.
            W.cssRule('.choicetable-left, .choicetable-right ' +
            '{ width: 200px !important; }');

            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q4',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'EnvVsGrowth',
                        orientation: 'V',
                        mainText: 'Here are two statements people sometimes make when discussing the environment and economic growth. ' +
                        'Which of them comes closer to your own point of view?',
                        choices: [ 'Protecting the environment should be given priority, even if it causes slower economic growth and some loss of jobs.', 'Economic growth and creating jobs should be the top priority, even if the environment suffers to some extent.'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////////
    // END OF SURVEY
    //////////////////////////////////////////////////////////////////////////////
    stager.extendStep('end', {
        widget: 'EndScreen',
        init: function() {
            node.game.doneButton.destroy();
        }
    });
};
