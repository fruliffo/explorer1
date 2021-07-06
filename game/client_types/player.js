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
        this.visuaStage = node.widgets.append('VisualStage', header, {
            next: false
        });

        // this.visualRound = node.widgets.append('VisualRound', header, {
        //     displayMode: [
        //         'COUNT_UP_STAGES_TO_TOTAL',
        //         // 'COUNT_UP_STEPS_TO_TOTAL'
        //     ]
        // });

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
                        mainText: 'Which languages do you feel most comfortable to use on mTurk?',
                        hint: '(Select 1 or 2 languages)',
                        choices: ['English', 'Assamese','Bengali','Bodo','Dogri',
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
                        max: 2020,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 3. LOCATION
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
                        mainText: 'Do you live in a rural or an urban area?',
                        choices: ['Rural','Urban'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'CustomInput',
                        id: 'City',
                        // orientation: 'V',
                        mainText: 'What is the name of your town/city or village?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'TimeSince',
                        // orientation: 'V',
                        mainText: 'For how long have you been living here?',
                        hint: '(in years)',
                        width: '100%',
                        type: 'int',
                        min: 0,
                        requiredChoice: true
                    }
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 4. MOST IMPORTANT 2 PROBLEMS
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
                        orientation: 'H',
                        // Number of choices per row/column.
                        choicesSetSize: 2,
                        mainText: 'In your opinion, which are the TWO most serious PROBLEMS India is facing currently?',
                        choices: [ 'Poverty','Discrimination against women','Poor sanitation', 'Infectious diseases','Poor education','Environmental pollution','Corruption','Other'],
                        shuffleChoices: false,
                        requiredChoice: 2,
                        selectMultiple: 2,
                        onclick: function(value, removed) {
                            var w, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.ImpProb.choices.length - 1;
                            w = forms.otherProb;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'otherProb',
                        mainText: 'Please name it.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                ],
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 5. ENVIRONMENT vs ECONOMIC GROWTH
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
                        'Which statement better describes your own opinion?',
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
        // Page 6. POLLUTION EXPOSURE: hours spent inside versus outdoors
        stager.extendStep('q6', {
            cb: function() {
            },
            // Make a widget step.
            widget: {
                name: 'ChoiceManager',
                id: 'q6',
                options: {
                    mainText: '',
                    forms: [
                        {
                            name: 'CustomInput',
                            id: 'Indoor',
                            mainText: 'During a typical week day, how many hours do you spend INDOORS?<br>',
                            hint: '(Think of all the time you are inside a building, for example at home, at work, visiting friends or relatives, including sleeping etc.)',
                            width: '100%',
                            type: 'int',
                            min: 0,
                            max: 24,
                            requiredChoice: true,
                        },
                        {
                            name: 'CustomInput',
                            id: 'Outdoor',
                            mainText: 'During a typical week day, how many hours do you spend OUTDOORS?<br>',
                            hint: '(Think of all the time you usually spend on the street, in parks, in front of your home or office, etc.)',
                            width: '100%',
                            type: 'int',
                            min: 0,
                            max: 24,
                            requiredChoice: true,
                        },
                    ]
                }
            }
        });


    //////////////////////////////////////////////////////////////////////////
    // Page 7. Time spend COMMUTING
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
                            id: 'Employed',
                            orientation: 'H',
                            mainText: 'Are you currently employed?',
                            choices: [ 'No','Yes'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w1, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.Employed.choices.length - 1;
                                w1 = forms.CommuteYN;
                                if (this.isChoiceCurrent(len)) {
                                    w1.show();
                                }
                                else {
                                    w1.hide();
                                }
                                W.adjustFrameHeight();
                            }
                        },
                        {
                            name: 'ChoiceTable',
                            id: 'CommuteYN',
                            orientation: 'H',
                            mainText: 'During a typical week day, do you have to commute to work?',
                            choices: [ 'No','Yes'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            hidden: true,
                            onclick: function(value, removed) {
                                var w, w1, w2, forms, len, len2;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.CommuteYN.choices.length - 1;
                                len2 = forms.CommuteMeans.choices.length - 1;
                                w = forms.CommuteTime;
                                w1 = forms.CommuteMeans;
                                w2 = forms.CommuteOther;
                                if (this.isChoiceCurrent(len)) {
                                    w.show();
                                    w1.show();
                                    if (w1.isChoiceCurrent(len2)) w2.show();
                                }
                                else {
                                    w.hide();
                                    w1.hide();
                                    w2.hide();
                                }
                                W.adjustFrameHeight();
                            }
                        },
                        {
                            name: 'CustomInput',
                            id: 'CommuteTime',
                            mainText: 'How long does it usually take you to communte to your workplace?<br>',
                            hint: '(Please give your answer in number of minutes for a one way commute.)',
                            width: '100%',
                            type: 'int',
                            min: 0,
                            hidden: true,
                            requiredChoice: true,
                        },
                        {
                            name: 'ChoiceTable',
                            id: 'CommuteMeans',
                            mainText: 'Which means of transportion do you typically use for your commute to work?<br>',
                            hint: '(Select all that apply.)',
                            choices: ['Walking','Bicycle','Auto rickshaw','Bus', 'Car','Other'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            selectMultiple: 6,
                            hidden: true,
                            onclick: function(value, removed) {
                                var w, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.CommuteMeans.choices.length - 1;
                                w = forms.CommuteOther;
                                if (this.isChoiceCurrent(len)) w.show();
                                else w.hide();
                                W.adjustFrameHeight();
                            }
                        },
                        {
                            name: 'CustomInput',
                            id: 'CommuteOther',
                            mainText: 'Which other means of transportation do you normally use to commute to work?',
                            width: '100%',
                            hidden: true,
                            requiredChoice: true,
                        }
                    ]
                }
            },
            done: function(values) {
                node.game.isEmployed = values.forms.Employed.value;
            }
        });

    //////////////////////////////////////////////////////////////////////////
    // Page 8. Work environment
    stager.extendStep('q8', {
        cb: function() {
            var emp = node.game.isEmployed;
            // TODO: fix disconnections in this stage.
            if (emp === "No") {
                node.done();
            }
            else {
                node.widgets.lastAppended.formsById.WorkOutdoor.show();
            }

        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q8',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'WorkOutdoor',
                        orientation: 'H',
                        mainText: 'When you are at work, do you typically work outdoors?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        onclick: function(value, removed) {
                            var w1, w2, w3, w4, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.WorkOutdoor.choices.length - 1;
                            w1 = forms.WorkWindows;
                            w2 = forms.WorkAC;
                            w3 = forms.WorkAP;
                            w4 = forms.WorkMask;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                                w2.show();
                                w3.show();
                                w4.hide();
                            }
                            else {
                                w1.hide();
                                w2.hide();
                                w3.hide();
                                w4.show();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'WorkMask',
                        orientation: 'H',
                        mainText: 'When you work outside, how often do you wear a breathing mask?',
                        choices: [ 'Most of the time','Rarely','Almost never'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'WorkWindows',
                        orientation: 'H',
                        mainText: 'In the room where you work, how often are the windows open?',
                        choices: [ 'Most of the time','Rarely','Almost never'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'WorkAC',
                        orientation: 'H',
                        mainText: 'At work, is there an air conditioner (AC) usually on?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'WorkAP',
                        orientation: 'H',
                        mainText: 'At work, is there an air purifier usually on?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 9. HOME environment
    stager.extendStep('q9', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q9',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'LightFuel',
                        orientation: 'H',
                        mainText: 'What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Solar lamp','Other'],
                        hint: '(Select all that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.LightFuel.choices.length - 1;
                            w1 = forms.LightOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'LightOther',
                        mainText: 'Which other is your main fuel for lighting at home?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HomeFuel',
                        orientation: 'H',
                        mainText: 'What do you use for cooking fuel at home?<br>',
                        choices: ['Dung cakes','Wood','Coal','Kerosene','Gas','Electric stove','Other'],
                        hint: '(Select all that apply.)',
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.HomeFuel.choices.length - 1;
                            w1 = forms.FuelOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'FuelOther',
                        mainText: 'Which other is your main fuel for cooking at home?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Kitchen',
                        orientation: 'V',
                        mainText: 'In your home, is cooking done in a separate room?',
                        choices: ['No, cooking is done in the main living area.','Yes, cooking is done in a separate kitchen.'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 10. HOME environment II
    stager.extendStep('q10', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q10',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'HomeTime',
                        mainText: 'During a typical week day, how many hours do you spend at home?',
                        width: '100%',
                        min: 0,
                        max: 24,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HOMEWindows',
                        orientation: 'H',
                        mainText: 'When you are at home, how often are the windows open?',
                        choices: [ 'Most of the time','Rarely','Almost never'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HomeAC',
                        orientation: 'H',
                        mainText: 'When you are at home, is there an air conditioner (AC) usually on?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HomeAP',
                        orientation: 'H',
                        mainText: 'When you are at home, is there an air purifier usually on?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Smoking',
                        orientation: 'H',
                        mainText: 'Do you smoke tobacco (cigarettes, hookah, bidi)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 11. Protection against pollution
    stager.extendStep('q11', {
        cb: function() {
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
                        id: 'PollProtection',
                        orientation: 'V',
                        mainText: 'In your home, how do you reduce your own exposure to air pollution?<br>',
                        hint: '(Select all that apply.)',
                        choices: [ 'The windows are frequently opened to ventilate.','An air purifier or particle filter is usually on.','Other','I do not do anything in particular.'],
                        selectMultiple: 3,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtection.choices.length - 2;
                            w1 = forms.PollProtectionOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'PollProtectionOther',
                        mainText: 'How else do you reduce your own exposure to air pollution at home?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 12. Protection against pollution
    stager.extendStep('q12', {
        cb: function() {
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
                        id: 'PollProtectionWork',
                        orientation: 'V',
                        mainText: 'At work, how to you reduce your own exposure to air pollution?<br>',
                        hint: '(Select all that apply.)',
                        choices: [ 'Windows are frequently open to ventilate.','An air purifier or particle filter is usually on.','Other','I do not do anything in particular.'],
                        selectMultiple: 3,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtectionWork.choices.length - 2;
                            w1 = forms.PollProtectionWorkOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'PollProtectionWorkOther',
                        mainText: 'How else do you reduce your own exposure to air pollution at work?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 13. Protection against pollution
    stager.extendStep('q13', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q13',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollProtectionOut',
                        orientation: 'V',
                        mainText: 'When you are outdoors, how you do to reduce your own exposure to air pollution?<br>',
                        hint: '(Select all that apply)',
                        choices: [ 'I wear a face mask.','I avoid spending time outside when pollution is high.','I avoid cycling or walking near roads with heavy traffic.','Other','I do not do anything in particular.'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 5,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtectionOut.choices.length - 2;
                            w1 = forms.PollProtectionOutOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'PollProtectionOutOther',
                        mainText: 'How else do you reduce your own exposure to air pollution when you are outside?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 14. Pollution information
    stager.extendStep('q14', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q14',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollutionGuess',
                        orientation: 'V',
                        mainText: 'The World Health Organization (WHO) recommends that air pollution levels as measured by concentrations of fine particulate matter (PM2.5) stay on average below 10 μg/m3. <br><br> According to your best guess, how do air pollution levels compare to the WHO recommended levels in your city? Select the answer that best completes the sentence below. <br><br>  "Pollution in my city is on average ... the WHO recommendation."<br>',
                        choices: [ 'much lower than','a little bit lower than.','equal to','two times larger than','five times larger than','ten times larger than'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 8g. Pollution information SOURCE
    stager.extendStep('q15', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q15',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollutionSource',
                        orientation: 'V',
                        mainText: 'Think about different ways to get information on current events. <br> From which of the following sources do you get information on current pollution levels in your city or village?<br>',
                        hint: '(Select all that apply.)',
                        choices: [ 'Newspapers','Radio','Television','Posters and leaflets around the city/village','Discussions with family and friends','My own searches online','A mobile app','Other','None'],
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.PollProtectionWork.choices.length - 2;
                            w1 = forms.SourceOther;
                            if (this.isChoiceCurrent(len)) {
                                w1.show();
                            }
                            else {
                                w1.hide();
                            }
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'SourceOther',
                        mainText: 'Which other source of pollution information?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 16. Pollution IMPACTS on PEOPLE
    stager.extendStep('q16', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q16',
            options: {
                mainText: 'Now consider the air pollution levels in your city. For each of the following aspects, how severe do you think the effect of air pollution is for the people living in your city?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollHealth',
                        orientation: 'H',
                        mainText: 'People`s HEALTH <br>',
                        hint: '(Such as lung and heart diseases, increased risk of premature death, and risks for unborn babies whose mothers are exposed to air pollution.)',
                        choices: [ 'Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollProd',
                        orientation: 'H',
                        mainText: 'People`s PRODUCTIVITY at work and at home <br>',
                        hint: '(Including sick days, physical endurance, and ability to concentrate.)',
                        choices: [ 'Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollIncome',
                        orientation: 'H',
                        mainText: 'People`s INCOME <br>',
                        hint: '(Including loss of income due to sick days and lower productivity.)',
                        choices: [ 'Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollBeauty',
                        orientation: 'H',
                        mainText: 'The AESTHETIC value (beauty) of your city <br>',
                        hint: '(Including how facades of buildings and the sky are affected by it.)',
                        choices: ['Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 17. Pollution IMPACTS (PERSONAL)
    stager.extendStep('q17', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q17',
            options: {
                mainText: 'Now think about yourself. For each of the following aspects, how severe do you think the effect of air pollution is for you?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PollHealthY',
                        orientation: 'H',
                        mainText: 'Your HEALTH<br>',
                        hint: '(Including lung and heart diseases, and increased risk of premature death.)',
                        choices: ['Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollProdY',
                        orientation: 'H',
                        mainText: 'Your PRODUCTIVITY at work and at home<br>',
                        hint: '(Including sick days, physical endurance, and ability to concentrate.)',
                        choices: ['Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PollIncomeY',
                        orientation: 'H',
                        mainText: 'Your INCOME<br>',
                        hint: '(Including loss of income due to sick days and lower productivity.)',
                        choices: ['Close to zero','Small','Somewhat severe','Severe','Extremely severe','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 18. Pollution exposure comparison
    stager.extendStep('q18', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q18',
            options: {
                mainText: 'Think about your own exposure to air pollution compared to that of other people living in your area. For instance, some people work outdoors and other people work in an office with an air purifier. Some people spend a lot of time in traffic during high pollution hours, others avoid it.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'ExposureComp',
                        orientation: 'H',
                        mainText: 'How do you rate your own exposure to air pollution compared to that of an average person in your locality?',
                        choices: [ 'Much smaller','Small','About the same','Higher','Much higher','I don`t know'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 19. EFFECTIVENESS MASKS
    stager.extendStep('q19', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q19',
            options: {
                mainText: 'Think about a common breathing mask.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'MaskEffective',
                        orientation: 'V',
                        mainText: 'In your opinion, how effective is wearing a clean breathing mask in reducing your exposure to air pollution when you are outside?',
                        choices: ['I don`t know','Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'MaskCost',
                        orientation: 'V',
                        mainText: 'In your situation, how costly would it be to purchase new breathing masks to wear all the time when you are outside?',
                        choices: ['I don`t know','Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 20. EFFECTIVENESS AIR PURIFIERS
    stager.extendStep('q20', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q20',
            options: {
                mainText: 'Think about an air purifier or particle filter.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'PurifEffective',
                        orientation: 'V',
                        mainText: 'In your opinion, how effective is using an air purifier constantly in reducing your exposure to air pollution when you are indoors?',
                        choices: ['I don`t know','Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'PurifCost',
                        orientation: 'V',
                        mainText: 'In your situation, how costly would it be to purchase a new air purifier?',
                        choices: ['I don`t know','Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'ElectrCost',
                        orientation: 'V',
                        mainText: 'In your situation, how costly would it be to constantly use an air purifier that consumes electricity?',
                        choices: ['I don`t know','Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 21. NEW TECHNOLOGY
    stager.extendStep('q21', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q21',
            options: {
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'PurifEffective',
                        mainText: 'Imagine a new technology was invented to filter out all pollution from the air in your city. <br> How much of your yearly income would you be willing to give up so that your city could install this technology?<br>',
                        hint: '(Please give a percentage in the range 0-100%.)',
                        width: '100%',
                        type: 'int',
                        min: 0,
                        max: 100,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 22. SUPPORT OF PROGRAMS TO REDUCE POLLUTION
    stager.extendStep('q22', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q22',
            options: {
                mainText: 'Think about possible public programs that could reduce air pollution in your city or village.<br> For each program, how much would you support it to be implemented in your area?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'Subsidies',
                        orientation: 'H',
                        mainText: 'Subsidies for gas stoves (LPG) and electricity for the poor',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'BurningBan',
                        orientation: 'H',
                        mainText: 'Ban on burning agricultural residue',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'VehicleTax',
                        orientation: 'H',
                        mainText: 'Higher vehicle registration taxes and road taxes',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'FuelTax',
                        orientation: 'H',
                        mainText: 'Higher fuel taxes for vehicles',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Trees',
                        orientation: 'H',
                        mainText: 'Planting of trees in urban centers/green urban landscapes',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'WasteBan',
                        orientation: 'H',
                        mainText: 'Ban on waste burning and strong enforcement with fines',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'Buses',
                        orientation: 'H',
                        mainText: 'Better public transportation services',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'NoDrive',
                        orientation: 'H',
                        mainText: 'Extension or introduction of no-drive days in your city or village',
                        choices: [ 'No support at all','Rather not support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 23. Nr household members + HH INCOME
    stager.extendStep('q23', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q23',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'NrHH',
                        mainText: 'How many people usually live in your household?<br>',
                        hint: '(Answer should include yourself in the count.)',
                        width: '100%',
                        type: 'int',
                        requiredChoice: true,
                        min: 0
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'HHIncome',
                        orientation: 'V',
                        mainText: '<strong>In 2020, what was the annual income of your household?</strong><br>',
                        hint: '(Please refer to the SUM of income of ALL members living in the same household as you in 2020.)',
                        //choices: [ 'Less than 5,000 USD', '5,000 - 7,500 USD', '7,500 - 10,000 USD', '10,000 - 12,500 USD', '12,500 - 15,000 USD', '15,000 - 25,000 USD','25,000 - 50,000 USD','More than 50,000 USD'],
                        choices: ['Less than 2,50,000 INR',' 2,50,000 INR – 5,00,000 INR','5,00,000 INR – 1,00,00,000 INR','1,00,00,000 INR – 1,50,00,000 INR','1,50,00,000 INR – 2,00,00,000 INR','2,00,00,000 INR – 3,00,00,000 INR','3,00,00,000 INR – 4,00,00,000 INR','4,00,00,000 INR or more'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 24. Education
    stager.extendStep('q24', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q24',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'Language',
                        orientation: 'V',
                        mainText: 'What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','University'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 25: Age and gender
    stager.extendStep('q25', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');

            // Speaces between choices.
            W.cssRule('table.choicetable { ' +
            'border-collapse: separate; border-spacing: 10px }');
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q25',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'age',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+'],
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: [ 'Female', 'Male', 'Other'],
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
