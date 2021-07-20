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

    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm'
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
                        id: 'q1_1',
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
                            len = forms.q1_1.choices.length - 1;
                            w = forms.q1_2;
                            if (this.isChoiceCurrent(len)) w.show();
                            else w.hide();
                            W.adjustFrameHeight();
                        }
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_2',
                        mainText: 'Please specify your language.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_3',
                        mainText: 'How do you say "Hello" in the language you selected above?<br>',
                        width: '100%',
                        requiredChoice: true,
                    }
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
                        id: 'q2_1',
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
                        id: 'q3_1',
                        mainText: 'Which STATE do you currently live in?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q3_2',
                        mainText: 'Which DISTRICT do you currently live in?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q3_3',
                        // orientation: 'V',
                        mainText: 'Do you live in a rural or an urban area?',
                        choices: ['Rural','Urban'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                    {
                        name: 'CustomInput',
                        id: 'q3_4',
                        // orientation: 'V',
                        mainText: 'What is the name of your village/town/city?',
                        width: '100%',
                        type: 'text',
                        requiredChoice: true
                    },
                    {
                        name: 'CustomInput',
                        id: 'q3_5',
                        // orientation: 'V',
                        mainText: 'For how many YEARS have you been living here?',
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
                        id: 'q4_1',
                        orientation: 'H',
                        // Number of choices per row/column.
                        choicesSetSize: 2,
                        mainText: 'In your opinion, what are the TWO most serious PROBLEMS India is facing currently?',
                        choices: [ 'Poverty','Discrimination against women','Poor sanitation', 'Infectious diseases','Poor education','Environmental pollution','Corruption','Incompetent politicians'],
                        shuffleChoices: true,
                        requiredChoice: 2,
                        selectMultiple: 2,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q4_2',
                        // orientation: 'V',
                        mainText: 'What <em>other</em> serious problem do you think is missing from the list above?<br>',
                        hint: "Feel free to write \"Nothing\" if you think all important problems have been mentioned above.",
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
                        id: 'q5_1',
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
                            id: 'q6_1',
                            mainText: 'During a typical week day, how many hours do you spend INDOORS?<br>',
                            hint: '(Think of all the time you are inside a building, for example at home, at work, visiting friends or relatives, including <em><strong>sleeping</strong></em> etc.)',
                            width: '100%',
                            type: 'int',
                            min: 0,
                            max: 24,
                            requiredChoice: true,
                        },
                        {
                            name: 'CustomInput',
                            id: 'q6_2',
                            mainText: 'During a typical week day, how many hours do you spend OUTDOORS?<br>',
                            hint: '(Think of all the time you usually spend on the street, at the market, in parks, in front of your home or office, etc.)',
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
                            id: 'q7_1',
                            orientation: 'H',
                            mainText: 'Are you currently employed?',
                            choices: [ 'No','Yes'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w1, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q7_1.choices.length - 1;
                                w1 = forms.q7_2;
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
                            id: 'q7_2',
                            orientation: 'H',
                            mainText: 'During a typical week day, do you have to commute to work?',
                            choices: [ 'No','Yes'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            hidden: true,
                            onclick: function(value, removed) {
                                var w, w1, w2, forms, len, len2;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q7_2.choices.length - 1;
                                len2 = forms.q7_2.choices.length - 1;
                                w = forms.q7_3;
                                w1 = forms.q7_4;
                                w2 = forms.q7_5;
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
                            id: 'q7_3',
                            mainText: 'How long does it usually take you to communte to your workplace?<br>',
                            hint: '(Please give your answer in number of <strong><em>minutes</em></strong> for a one way commute.)',
                            width: '100%',
                            type: 'int',
                            min: 0,
                            hidden: true,
                            requiredChoice: true,
                        },
                        {
                            name: 'ChoiceTable',
                            id: 'q7_4',
                            mainText: 'Which means of transportion do you typically use for your commute to work?<br>',
                            hint: '(Select <em><strong>all</strong></em> that apply.)',
                            choices: ['Walking','Bicycle','Auto rickshaw','Bus', 'Car','Other'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            selectMultiple: 6,
                            hidden: true,
                            onclick: function(value, removed) {
                                var w, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q7_4.choices.length - 1;
                                w = forms.q7_5;
                                if (this.isChoiceCurrent(len)) w.show();
                                else w.hide();
                                W.adjustFrameHeight();
                            }
                        },
                        {
                            name: 'CustomInput',
                            id: 'q7_5',
                            mainText: 'Which other means of transportation do you normally use to commute to work?',
                            width: '100%',
                            hidden: true,
                            requiredChoice: true,
                        }
                    ]
                }
            },
            done: function(values) {
                node.game.isEmployed = values.forms.q7_1.value;
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
                node.widgets.lastAppended.formsById.q8_1.show();
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
                        id: 'q8_1',
                        orientation: 'H',
                        mainText: 'When you are at work, do you typically work outdoors?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        onclick: function(value, removed) {
                            var w1, w2, w3, w4, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q8_1.choices.length - 1;
                            w1 = forms.q8_2;
                            w2 = forms.q8_3;
                            w3 = forms.q8_4;
                            w4 = forms.q8_5;
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
                        id: 'q8_5',
                        orientation: 'H',
                        mainText: 'When you work outside, how often do you wear a breathing mask?',
                        choices: ['Never', 'Rarely','Most of the time','Always'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_2',
                        orientation: 'H',
                        mainText: 'In the room where you work, how often are the windows open?',
                        choices: ['Never','Rarely','Most of the time','Always'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_3',
                        orientation: 'H',
                        mainText: 'At work, is there an air conditioner (AC) usually on?',
                        choices: ['No', 'Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_4',
                        orientation: 'H',
                        mainText: 'At work, is there an air purifier usually on?',
                        choices: ['No', 'Yes'],
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
                        name: 'CustomInput',
                        id: 'q9_1',
                        mainText: 'During a typical week day, how many hours do you spend at HOME?<br>',
                        hint: '(Your answer should include the hours spent  <em><strong>sleeping</strong></em>.)',
                        width: '100%',
                        type: 'int',
                        min: 0,
                        max: 24,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q9_2',
                        orientation: 'H',
                        mainText: 'What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q9_2.choices.length - 1;
                            w1 = forms.q9_3;
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
                        id: 'q9_3',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q9_4',
                        orientation: 'H',
                        mainText: 'What do you use for cooking fuel at home?<br>',
                        choices: ['Dung cakes','Wood','Coal','Kerosene','Gas','Electric stove','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        selectMultiple: 7,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q9_4.choices.length - 1;
                            w1 = forms.q9_5;
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
                        id: 'q9_5',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q9_6',
                        orientation: 'V',
                        mainText: 'In your home, is cooking done in a separate room?',
                        choices: ['No, cooking is done in the main living area.','Yes, cooking is done in a separate kitchen.'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q9_7',
                        orientation: 'H',
                        mainText: 'Do you smoke tobacco (cigarettes, hookah, bidi, etc.)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });




    //////////////////////////////////////////////////////////////////////////
    // Page 10. Protection against pollution: HOME
    stager.extendStep('q10', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q10',
            options: {
                mainText: '<em>Think about the environment in your HOME.<em>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q10_1',
                        orientation: 'H',
                        mainText: 'In your HOME, how frequently are windows open?<br>',
                        choices: ['Never','Less than once a day','A few times each day','Most of the time'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q10_2',
                        orientation: 'H',
                        mainText: 'Do you own an air conditioner?<br>',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q10_3',
                        orientation: 'H',
                        mainText: 'Do you own an air purifier or particle filter?<br>',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q10_4',
                        orientation: 'H',
                        mainText: 'When you are home, do you do something to reduce your own exposure to air pollution?<br>',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q10_4.choices.length - 1;
                            w1 = forms.q10_5;
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
                        id: 'q10_5',
                        orientation: 'V',
                        mainText: 'What do you do to reduce your exposure to air pollution at home?<br>',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 11. Protection against pollution: OUTDOORS
    stager.extendStep('q11', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q11',
            options: {
                mainText: '<em>Think about all the time you are OUTDOORS.<em>',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q11_1',
                        orientation: 'V',
                        mainText: 'What can a person do to reduce their own exposure to pollution while being OUTDOORS?<br>',
                        hint: "Feel free to write <em>'Nothing'</em> if you think that one cannot do anything to reduce their own exposure to pollution while outdoors.",
                        width: '100%',
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 12. POLLUTION IS VISIBLE
    stager.extendStep('q12', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q12',
            options: {
                mainText: '<em>In your opinion, how much do you agree with the following statement?<em>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q12_1',
                        orientation: 'H',
                        mainText: 'Air pollution is present only if you can see it.<br>',
                        choices: ["I don't know",'Strongly disagree','Somewhat disagree','Somewhat agree','Strongly agree'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Page 13. PAST ILLNESSES: FAMILY
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
                        id: 'q13_1',
                        orientation: 'V',
                        mainText: 'In the past 5 years, has any member of your close family or circle of friends been diagnosed with any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'Cold and/or flu','Conjunctivities','High blood pressure','Heart disease','Lung disease','Diabetes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 10,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 14. PAST ILLNESSES: you
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
                        id: 'q14_1',
                        orientation: 'V',
                        mainText: 'In the past 5 years, have YOU been diagnosed with any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'Cold and/or flu','Conjunctivities','High blood pressure','Heart disease','Lung disease','Diabetes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 10,
                    }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Page 15. Pollution information
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
                        id: 'q15_1',
                        orientation: 'V',
                        //mainText: 'The World Health Organization (WHO) recommends that air pollution levels defined as concentrations of fine particulate matter (PM2.5) stay on average <em>below</em> 10 μg/m3. <br><br> In your opinion, how do air pollution levels  in your village/town/city compare to the WHO recommended levels for clean air? Select the answer that best completes the sentence below. <br><br>  "Pollution in my village/town/city is on average ... the WHO recommendation."<br>',
                        mainText: "Think about the average air pollution levels in London, United Kingdom.<br> How much <em>lower</em> or <em>higher</em> do you think air pollution levels in your village/town/city are compared to those of London (UK)?",
                        choices: [ 'much lower','a little bit lower','similar','a little bit higher','much higher',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 16. Pollution information SOURCE
    stager.extendStep('q16', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q16',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q16_1',
                        orientation: 'V',
                        mainText: 'Think about different ways to get information on current pollution levels. <br> Do you get information on pollution from any of the following sources?<br>',
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        choices: ['None','Newspapers','Radio','Television','Posters and leaflets around the city/village','Discussions with family and friends','My own searches online','A mobile app','Other'],
                        selectMultiple: 9,
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q16_1.choices.length - 1;
                            w1 = forms.q16_2;
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
                        id: 'q16_2',
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
    // Page 17. Pollution IMPACTS on PEOPLE
    stager.extendStep('q17', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q17',
            options: {
                //mainText: 'Now consider the air pollution levels in your village or city. For each of the following aspects, how large or small do you think the impact of air pollution is for the PEOPLE living in your village or city?',
                mainText: 'Think about the average Indian mTurker taking this survey. For each of the following aspects, how large or small do you think the <em><strong>impact of air pollution</em></strong> is on him/her?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q17_1',
                        orientation: 'H',
                        mainText: "The average Indian mTurker's PRODUCTIVITY at work and at home <br>",
                        //hint: '(For example, an increase in the number of sick days, a reduction in their physical endurance and their ability to concentrate.)',
                        choices: [ 'No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_2',
                        orientation: 'H',
                        mainText: "The average Indian mTurker's  INCOME <br>",
                        //hint: '(For example, a loss of income due to sick days and lower productivity.)',
                        choices: [ 'No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_3',
                        orientation: 'H',
                        mainText: "The average Indian mTurker's WEIGHT (in kilograms)<br>",
                        choices: ['No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_4',
                        orientation: 'H',
                        mainText: "The average Indian mTurker's  HEALTH <br>",
                        //hint: '(For example, lung and heart diseases, increased risk of premature death, and risks for unborn babies whose mothers are exposed to air pollution.)',
                        choices: [ 'No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 18. Pollution IMPACTS (PERSONAL)
    stager.extendStep('q18', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q19',
            options: {
                mainText: 'Now think about <em><strong>yourself</em></strong>. For each of the following aspects, how large or small do you think the impact of air pollution is for YOU?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q18_1',
                        orientation: 'H',
                        mainText: 'Your HEALTH<br>',
                        //hint: '(Including lung and heart diseases, and increased risk of premature death.)',
                        choices: ['No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q18_2',
                        orientation: 'H',
                        mainText: "Your WEIGHT (in kilograms)<br>",
                        choices: ['No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q18_3',
                        orientation: 'H',
                        mainText: 'Your PRODUCTIVITY at work and at home<br>',
                        //hint: '(Including sick days, physical endurance, and ability to concentrate.)',
                        choices: ['No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q18_4',
                        orientation: 'H',
                        mainText: 'Your INCOME<br>',
                        //hint: '(Including loss of income due to sick days and lower productivity.)',
                        choices: ['No impact','Small','Somewhat severe','Severe','Extremely severe',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 20. Pollution exposure comparison
    stager.extendStep('q19', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q19',
            options: {
                mainText: 'Think about your own exposure to air pollution compared to that of other people living in your area. <br>- For instance, some people work outdoors and other people work in an office with an air purifier. <br>- Some people spend a lot of time in traffic during high pollution hours, others avoid it.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q19_1',
                        orientation: 'H',
                        mainText: 'How do you rate your own exposure to air pollution compared to that of an average person in your locality?',
                        choices: ['Much smaller','A bit smaller','About the same','A bit higher','Much higher',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 20. EFFECTIVENESS MASKS
    stager.extendStep('q20', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q20',
            options: {
                mainText: 'Think about a typical breathing mask.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q20_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is wearing a clean breathing mask in reducing your exposure to air pollution when you are outside?',
                        choices: ["I don't know",'Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q20_2',
                        orientation: 'V',
                        mainText: 'In your situation, how <em>costly</em> would it be to purchase breathing masks so you can wear a clean mask every time you go outside?',
                        choices: ["I don't know",'Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 22. EFFECTIVENESS AIR PURIFIERS
    stager.extendStep('q21', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q21',
            options: {
                mainText: 'Think about an air purifier or particle filter.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q21_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is using an air purifier constantly in reducing your exposure to air pollution when you are indoors?',
                        choices: ["I don't know",'Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q21_2',
                        orientation: 'V',
                        mainText: 'In your situation, how <em>costly</em> do you think it would be to purchase a new air purifier?',
                        choices: ["I don't know",'Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q21_3',
                        orientation: 'V',
                        mainText: 'In your situation, how costly do you think it would be to constantly use an air purifier that consumes electricity?',
                        choices: ["I don't know",'Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 23. NEW TECHNOLOGY
    stager.extendStep('q22', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q22',
            options: {
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q22_1',
                        mainText: 'Imagine a new technology was invented to filter out all pollution from the air in your city. <br> What PERCENTAGE of your yearly income would you be willing to give up so that your city could install this technology?<br>',
                        hint: '(Please give your answer as a PERCENTAGE in the 0 - 100 range.)',
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
    // Page 24. SUPPORT OF PROGRAMS TO REDUCE POLLUTION
    stager.extendStep('q23', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q23',
            options: {
                mainText: 'Think about possible public programs that could reduce air pollution in your village/town/city.<br> For each program, how much would you support it to be implemented in your area?',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q23_1',
                        orientation: 'H',
                        mainText: 'Subsidies for gas stoves (LPG) and electricity for the poor',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_2',
                        orientation: 'H',
                        mainText: 'Ban on burning agricultural residue',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_3',
                        orientation: 'H',
                        mainText: 'Higher vehicle registration taxes and road taxes',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_4',
                        orientation: 'H',
                        mainText: 'Higher fuel taxes for vehicles',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_5',
                        orientation: 'H',
                        mainText: 'Planting of trees in urban centers/green urban landscapes',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_6',
                        orientation: 'H',
                        mainText: 'Ban on waste burning and strong enforcement with fines',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_7',
                        orientation: 'H',
                        mainText: 'Better public transportation services',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_8',
                        orientation: 'H',
                        mainText: 'Extension or introduction of no-drive days in your city or village',
                        choices: [ 'No support at all','Rather no support','Indifferent','Support a little','Strongly support'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 24. POLLUTION IS VISIBLE
    stager.extendStep('q24', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q24',
            options: {
                mainText: '<strong>Think about all the people in your network, such as family, friends, and coworkers.<strong>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q24_1',
                        orientation: 'H',
                        mainText: 'How <em>worried</em> are the people in your network about the air pollution levels in your village/town/city?<br>',
                        choices: ["I don't know",'Not at all','Not much','A bit','Very much'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 25. Nr household members + HH INCOME
    stager.extendStep('q25', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q25',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q25_1',
                        mainText: 'How many people usually live in your household?<br>',
                        hint: '(Think about all the people that live at least 8 month per year in your house. Answer should include yourself in the count.)',
                        width: '100%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q25_2',
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
    // Page 26. Education
    stager.extendStep('q26', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q26',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q26_1',
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
    // Page 27: Age and gender
    stager.extendStep('q27', {
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
            id: 'q27',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q27_1',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+'],
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q27_2',
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

    //////////////////////////////////////////////////////////////////////////
    // Page 28. INCOME RANKING
    stager.extendStep('q28', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q28',
            options: {
                mainText: '<strong>Think about all the people living in the same village/town/city as you do.</strong> ',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q28_1',
                        mainText: 'In your opinion, what PERCENTAGE of the population living in your village/town/city has a LOWER annual income?<br>',
                        hint: 'Please give your answer as a PERCENTAGE in the 0 - 100 range. For example, if you think that 50% of the population has an annual income that is lower than yours, write "50".',
                        width: '100%',
                        type: 'int',
                        min: 0,
                        max: 100,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 29. Aadhaar
    stager.extendStep('q29', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q29',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q29_1',
                        orientation: 'H',
                        mainText: 'Are you enrolled in Aadhaar?',
                        choices: ['Yes',"No","I don't know"],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
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
