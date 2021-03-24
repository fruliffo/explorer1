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

var req = true;

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

        this.states = [ '1', '2', '3' ];
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

    stager.extendStage('survey', {
        frame: 'survey.htm'
    });
    //////////////////////////////////////////////////////////////////////////
    // Page 1. Language
    stager.extendStep('q1', {
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
            id: 'q1',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'Language',
                        orientation: 'H',
                        mainText: 'Which languages do you feel most comfortable to answer a HIT in?',
                        // hint: 'Choose max two:',
                        choices: [ 'Assamese','Bengali','Bodo','Dogri','English',
                        'Gujarati','Hindi','Kannada','Kashmiri','Konkani',
                        'Maithili','Malayalam','Marathi','Mora','Meitei','Nepali',              'Odia','Punjabi','Sanskrit','Santali','Sindhi','Tamil',
                        'Telugu','Urdu','Other'],
                        shuffleChoices: false,
                        requiredChoice: req,
                        selectMultiple: 2,
                        // Number of choices per row/column.
                        choicesSetSize: 6,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.Language.choices.length - 1;
                            w = forms.otherlanguage;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'otherlanguage',
                        mainText: 'Please specify your language.',
                        width: '100%',
                        hidden: true
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 2. Year of birth
    stager.extendStep('q2', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q2',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'YearBirth',
                        mainText: 'What is your year of birth?',
                        width: '100%',
                        type: 'int',
                        min: 1900,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. Urban or rural
    stager.extendStep('q3', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q3',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'State',
                        mainText: 'Which STATE do you currently live in?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true,
                        validation: function(value) {
                            var res;
                            value = value.trim();
                            res = { value: value };

                            if (value === '' && this.requiredChoice) {
                                res.err = this.getText('emptyErr');
                                return res;
                            }

                            // Custom validation (only reports about last word).
                            if (!J.inArray(value, node.game.states)) {
                                res.err = 'Invalid state: ' + value;
                            }

                            return res;
                    }
                    },
                    {
                        name: 'CustomInput',
                        id: 'District',
                        mainText: 'Which DISTRICT do you currently live in?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'UrbRur',
                        // orientation: 'V',
                        mainText: 'Do you live in an urban or a rural area?',
                        choices: ['Urban','Rural'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 4. Most imp problem
    stager.extendStep('q4', {
        cb: function() {
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
                        id: 'ImpProb',
                        orientation: 'V',
                        mainText: 'In your opinion, which are the TWO most serious PROBLEMS India is facing currently?', //Which of the following problems do you consider to be the TWO most serious ones for India currently?' ,
                        //choices: [ 'People living in poverty and need','Discrimination against girls and women','Poor sanitation and infectious diseases','Inadequate education','Environmental pollution','Unemployment','Personal safety','Corruption','Ethnic/religious tensions'],
                        choices: [ 'Poverty','Discrimination against girls and women','Poor sanitation and infectious diseases','Inadequate education','Environmental pollution','Unemployment','Corruption','Ethnic/religious tensions'],
                        shuffleChoices: true,
                        requiredChoice: 2,
                        selectMultiple: 2,
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 5. Environment vs growth
    stager.extendStep('q5', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q5',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'EnvVsGrowth',
                        orientation: 'V',
                        mainText: 'Here are two statements people sometimes make when discussing the ENVIRONMENT and ECONOMIC GROWTH. <br><br>' +
                        'Which of them comes closer to your own point of view?',
                        choices: [
                            '<strong>Protecting the environment</strong> should be given priority, even if it causes slower economic growth and some loss of jobs.',
                            '<strong>Economic growth and creating jobs</strong> should be the top priority, even if the environment suffers to some extent.'],
                        shuffleChoices: true,
                        requiredChoice: req
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 6. Gov versus self
    stager.extendStep('q6', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q6',
            options: {
                mainText: '<strong>Below are two pairs of opposing statements. For each pair, please specify which statement you agree more with.</strong>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'ImpProb',
                        orientation: 'V',
                        mainText: 'Pair 1 <br/> A: Incomes should be made more equal.<br/> B: We need larger income differences as incentives for individual effort',
                        choices: [ 'I strongly agree with A.','I somewhat agree with A.','I somewhat agree with B.','I strongly agree with B.'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'GovResp',
                        orientation: 'V',
                        mainText:'Pair 2 <br/> X: The Goverment should take more responsibility to ensure that everyone is provided for.<br/> Y:  People should take more responsibility to provide for themselves.',
                        choices: [ 'I strongly agree with X.','I would rather agree with X than with Y.','I would rather agree with Y than with X.','I strongly agree with Y.'],
                        requiredChoice: true
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 7. Pollution protection
    stager.extendStep('q7', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q7',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollProtYN',
                        orientation: 'V',
                        mainText: 'Do you usually take any protective measures against air pollution?',
                        choices: [ 'No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: req,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtYN.choices.length - 1;
                            w = forms.PollProtWhich;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollProtWhich',
                        orientation: 'V',
                        mainText: 'Which protective measure do you usually use?',
                        choices: [ 'I wear a breathing mask','I avoid spending time outdoors in polluted areas','I use an air purifier at home','I use an air purifier at work','Another practice'],
                        shuffleChoices: false,
                        selectMultiple: 5,
                        requiredChoice: true,
                        hidden: true,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtWhich.choices.length - 1;
                            w = forms.otherPollmeasure;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'otherPollmeasure',
                        mainText: 'Please specify the protection measure you usually rely upon.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true
                    },
                ],
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Page 8. Trust
    stager.extendStep('q8', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { text-align: center !important; ' +
            // 'font-weight: normal; padding-left: 10px; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('.choicetable-maintext { display: block; ' +
            // 'margin-bottom: 30px !important; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('dt.question { ' +
            // 'margin-top: 20px !important; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('dt.question:first-of-type { ' +
            // 'margin-top: 10px !important; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q8',
            options: {
                mainText: '<strong>Below is a list of a number of organizations. For each one, could you specify how much <em>confidence</em> you have in them: is it a great deal of confidence, quite a lot of confidence, not very much confidence or none at all?</strong>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'Religious',
                        orientation: 'H',
                        mainText: 'The religious institutions' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Army',
                        orientation: 'H',
                        mainText: 'The armed forces' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Press',
                        orientation: 'H',
                        mainText: 'The press' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Television',
                        orientation: 'H',
                        mainText: 'The television' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Unions',
                        orientation: 'H',
                        mainText: 'The labor unions' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Police',
                        orientation: 'H',
                        mainText: 'The police' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Courts',
                        orientation: 'H',
                        mainText: 'The courts' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'NatGov',
                        orientation: 'H',
                        mainText: 'The national government' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'StateGov',
                        orientation: 'H',
                        mainText: 'The state government' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PolParties',
                        orientation: 'H',
                        mainText: 'The political parties' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'University',
                        orientation: 'H',
                        mainText: 'Universities' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'NGO',
                        orientation: 'H',
                        mainText: 'The non-governmental institutions (NGOs)' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'SocialMedia',
                        orientation: 'H',
                        mainText: 'The social media (such as Twitter, Facebook, YouTube, Instagram)' ,
                        choices: ['A great deal','Quite a lot','Not very much','None at all'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 9. Nr household members + HH INCOME
    stager.extendStep('q9', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { text-align: left !important; ' +
            // 'font-weight: normal; padding-left: 10px; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('dt.question:first-of-type { ' +
            // 'margin-top: 20px !important; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q9',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'NrHH',
                        mainText: 'How many people reside in your household?',
                        hint: ('Answer should include yourself in the count.'),
                        width: '100%',
                        type: 'int',
                        requiredChoice: true,
                        min: 0
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HHIncome',
                        orientation: 'V',
                        mainText: '<strong>In 2020, what was the annual income in your household?</strong>',
                        hint: 'Please refer to the SUM of income of ALL members living in the same household as you in 2020.',
                        choices: [ 'Less than 5,000 USD', '5,000 - 7,500 USD', '7,500 - 10,000 USD', '10,000 - 12,500 USD', '12,500 - 15,000 USD', '15,000 - 25,000 USD','25,000 - 40,000 USD','40,000 - 60,000 USD','60,000 - 75,000 USD','More than 75,000 USD'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 10. Education
    stager.extendStep('q10', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { text-align: left !important; ' +
            // 'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q10',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'Language',
                        orientation: 'V',
                        mainText: 'What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational school','University'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
            }
        }
    });

    // Page 11: Age and gender
    stager.extendStep('q11', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { ' +
            // 'font-weight: normal; padding-left: 10px; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('.choicetable-maintext { display: block; ' +
            // 'margin-bottom: 30px !important; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('dt.question { ' +
            // 'margin-top: 100px !important; }');
            //
            // // More space between the text of the question and the choices.
            // W.cssRule('dt.question:first-of-type { ' +
            // 'margin-top: 20px !important; }');
            //
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');

            // Speaces between choices.
            W.cssRule('table.choicetable { ' +
                'border-collapse: separate; border-spacing: 10px }');
            //
            // // Rounded borders.
            // W.cssRule('table.choicetable td { ' +
            //     'border-radius: 5px; }');

        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q11',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'age',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+', 'Prefer not to disclose'],
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: [ 'Female', 'Male', 'Other', 'Prefer not to disclose' ],
                        requiredChoice: req
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
    // Page 12. MTurk frequency
    stager.extendStep('q12', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { text-align: left !important; ' +
            // 'font-weight: normal; padding-left: 10px; }');
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q12',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'HHIncome',
                        orientation: 'V',
                        mainText: 'Last month, how often have you used MTurk?',
                        choices: [ 'Every day','A few times each week','Once a week', 'Less than once a week'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 13. Internet connection
    stager.extendStep('q13', {
        cb: function() {
            // // Modify CSS rules on the fly.
            // W.cssRule('.choicetable-left, .choicetable-right ' +
            // '{ width: 200px !important; }');
            //
            // W.cssRule('table.choicetable td { text-align: left !important; ' +
            // 'font-weight: normal; padding-left: 10px; }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q13',
            options: {
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'InternetConn',
                        mainText: 'How happy are you with the internet connection you usually use for MTurk?',
                        orientation: 'V',
                        choices: [ 'Extremely dissatisfied', 'Somewhat dissatisfied', 'Neither satisfied nor dissatisfied', 'Somewhat satisfied', 'Extremely satisfied'],
                        shuffleChoices: false,
                        requiredChoice: req
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
