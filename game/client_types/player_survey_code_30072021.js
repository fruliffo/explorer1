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
const J = ngc.JSUS;

//var req = false;

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

        this.discBox = node.widgets.append('DisconnectBox', header, {
            disconnectCb: function() {
                W.init({
                    waitScreen: true
                });
                node.game.pause('Disconnection detected. Please refresh ' +
                                'to reconnect.');
                alert('Disconnection detected. Please refresh the page ' +
                      'to continue. You might have to use the original link provided on MTurk.');
            },
            connectCb: function() {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
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
                        'Maithili','Malayalam','Marathi','Mora','Meitei','Nepali',
                        'Odia','Punjabi','Sanskrit','Santali','Sindhi','Tamil',
                        'Telugu','Urdu','Other'],
                        shuffleChoices: false,
                        requiredChoice: true,
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

                            w = forms.q1_4;
                            if (this.currentChoice.length === 2) w.show();
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
                        mainText: 'What is the name of the last thing you ate or drank today in the language you selected above?<br>',
                        width: '100%',
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_4',
                        mainText: 'You selected two languages. What is the name of the last thing you ate or drank today in the second language you selected above?<br>',
                        width: '100%',
                        hidden: true,
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
                        mainText: 'Which STATE of India do you currently live in?',
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
                        mainText: 'Do you live in a village or a town/city area?',
                        choices: ['Village','Town or city'],
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
                        choices: [ 'Poverty',
                        'Discrimination against women',
                        'Poor sanitation',
                        'Infectious diseases',
                        'Poor education',
                        'Terrorism',
                        'Civil conflict',
                        'Environmental pollution',
                        'Corruption',
                        'Incompetent politicians'],
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
                        requiredChoice: true
                    }
                ],
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 5. WORK: Commute
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
                            orientation: 'H',
                            mainText: 'Are you currently employed?',
                            choices: [ 'No','Yes'],
                            shuffleChoices: false,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w1, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q5_1.choices.length - 1;
                                w1 = forms.q5_2;
                                w2 = forms.q5_4;
                                if (this.isChoiceCurrent(len)) {
                                    w1.show();
                                    w2.show();
                                }
                                else {
                                    w1.hide();
                                    w2.hide();
                                }
                                W.adjustFrameHeight();
                            }
                        },
                        {
                            name: 'ChoiceTable',
                            id: 'q5_2',
                            orientation: 'V',
                            mainText: 'In which sector do you work?<br>',
                            choices: ['Mining',
                            'Manufacturing',
                            'Electricty/water/gas/waste',
                            'Construction',
                            'Transportation',
                            'Buying and selling',
                            'Financial/insurance/real estate services',
                            'Personal services',
                            'Education',
                            'Health',
                            'Public administration',
                            'Professional/scientific/technical activities',
                            'Other'],
                            shuffleChoices: false,
                            hidden: true,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q7_2.choices.length - 1;
                                w = forms.q7_3;
                                if (this.isChoiceCurrent(len)) w.show();
                                else w.hide();
                            }
                        },
                        {
                            name: 'CustomInput',
                            id: 'q5_3',
                            mainText: 'Please specify.',
                            width: '100%',
                            hidden: true,
                            requiredChoice: true,
                        },
                        {
                            name: 'ChoiceTable',
                            id: 'q5_4',
                            orientation: 'V',
                            mainText: 'During the time you are working, where do you spend most of your time?',
                            choices: ['Inside a building/office with walls',
                            'In a sheltered place with a roof but no walls',
                            'In the open air',
                            'Driving',
                            'Other'],
                            shuffleChoices: false,
                            hidden: true,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q7_4.choices.length - 1;
                                w = forms.q7_5;
                                if (this.isChoiceCurrent(len)) w.show();
                                else w.hide();
                            }
                        },
                        {
                            name: 'CustomInput',
                            id: 'q5_5',
                            mainText: 'Please specify.',
                            width: '100%',
                            hidden: true,
                            requiredChoice: true,
                        },
                    ]
                }
            },
            done: function(values) {
                node.game.isEmployed = values.forms.q5_1.value;
            }
        });

    //////////////////////////////////////////////////////////////////////////
    // Page 6. Work environment
    stager.extendStep('q6', {
        cb: function() {
            var emp = node.game.isEmployed;
            // TODO: fix disconnections in this stage.
            if (emp === "No") {
                node.done();
            }
            else {
                node.widgets.lastAppended.formsById.q6_1.show();
            }

        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q6',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q6_1',
                        orientation: 'H',
                        mainText: 'At work, is there an air conditioner (AC) usually on?',
                        choices: ['No', 'Yes','Does not apply'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_2',
                        orientation: 'H',
                        mainText: 'At work, is there an air purifier usually on?',
                        choices: ['No', 'Yes','Does not apply'],
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
    // Page 7. HOME environment
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
                        name: 'CustomInput',
                        id: 'q7_1',
                        mainText: 'During a typical week day, how many hours do you spend at HOME?<br>',
                        hint: '(Your answer should include the hours spent <em><strong>sleeping</strong></em>.)',
                        width: '100%',
                        type: 'int',
                        min: 0,
                        max: 24,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q7_2',
                        orientation: 'H',
                        mainText: 'What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Gas','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q7_2.choices.length - 1;
                            w1 = forms.q7_3;
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
                        id: 'q7_3',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q7_4',
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
                            len = forms.q7_4.choices.length - 1;
                            w1 = forms.q7_5;
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
                        id: 'q7_5',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q7_6',
                        orientation: 'V',
                        mainText: 'In your home, is cooking done in a separate room?',
                        choices: ['No, cooking is done in the main living area.','Yes, cooking is done in a separate kitchen.'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });




    //////////////////////////////////////////////////////////////////////////
    // Page 8. Protection against pollution: HOME
    stager.extendStep('q8', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q8',
            options: {
                mainText: '<em>Think about your HOME.<em>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q8_2',
                        orientation: 'H',
                        mainText: 'Do you own an air conditioner?<br>',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_3',
                        orientation: 'H',
                        mainText: 'Do you own an air purifier or particle filter?<br>',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_4',
                        orientation: 'H',
                        mainText: 'When you are home, do you do something to reduce your own exposure to air pollution?<br>',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q8_4.choices.length - 1;
                            w1 = forms.q8_5;
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
                        id: 'q8_5',
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
    // Page 9. Protection against pollution: OUTDOORS
    stager.extendStep('q9', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q9',
            options: {
                mainText: '<em>Think about all the time you are OUTDOORS.<em>',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q9_1',
                        mainText: 'What can you do to reduce your own exposure to air pollution while being OUTDOORS?<br>',
                        hint: "Feel free to write <em>'Nothing'</em> if you think you cannot do anything to reduce your own exposure to air pollution while outdoors.",
                        requiredChoice: true,
                        width: '100%'
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 10. POLLUTION IS VISIBLE
    stager.extendStep('q10', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q10',
            options: {
                mainText: '<em>In your opinion, how much do you agree with the following statement?<em>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q10_1',
                        orientation: 'H',
                        mainText: 'Air pollution is present only if you can see it.<br>',
                        choices: ["I don't know",'Strongly disagree','Strongly agree'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Page 11. PAST ILLNESSES: FAMILY
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
                        id: 'q11_1',
                        orientation: 'V',
                        mainText: 'In the past 5 years, has any member of your close family or circle of friends (not yourself) been diagnosed with any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to disclose'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 10,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 12. PAST ILLNESSES: you
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
                        id: 'q12_1',
                        orientation: 'V',
                        mainText: 'In the past 5 years, have YOU been diagnosed with any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to disclose'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 10,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q12_2',
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
    // Page 13. Pollution information
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
                        mainText: "Think about the least and the most polluted cities in the world.<br/>How does your village/town/city rank on a scale from 1 to 7, where 1 means \"least polluted\" and 7 means \"most polluted\"?",
                        choices: J.seq(1,7),
                        shuffleChoices: false,
                        requiredChoice: true,
                        left: "Least Polluted",
                        right: "Most Polluted"
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 14. Pollution IMPACTS on PEOPLE
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
                        mainText:'Think about the potential damages of air pollution. Select all aspects that are significantly impacted by air pollution.',
                        hint: 'Select <em><strong>all</em></strong> that apply.',
                        choices: [ "People's productivity at work or at home","People's health","People's weight","People's income","Food quality","School performance","None of the above","Marriage success","Civil violence"],
                        shuffleChoices: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q14_2',
                        orientation: 'V',
                        mainText:'Think about YOUR everyday exposure to air pollution. In your situation, how large or small is the impact of air pollution on your HEALTH?',
                        choices: [ 'No impact','Small','Somewhat large','Large','Extremely large',"I don't know"],
                        shuffleChoices: true,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });




    //////////////////////////////////////////////////////////////////////////
    // Page 15. Pollution exposure comparison
    stager.extendStep('q15', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q15',
            options: {
                mainText: 'Think about your own exposure to air pollution compared to that of other people living in your area. <br>- For instance, some people work in open air and other people work in an office with an air purifier. <br>- Some people spend a lot of time in traffic during high pollution hours, others avoid it.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q15_1',
                        orientation: 'H',
                        mainText: 'How do you rate your own exposure to air pollution compared to that of an average person in your village/town/city?',
                        choices: ['Much smaller','A bit smaller','About the same','A bit higher','Much higher',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 16. EFFECTIVENESS MASKS
    stager.extendStep('q16', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q16',
            options: {
                mainText: 'Think about a typical breathing mask.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q16_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is wearing a clean breathing mask in reducing your exposure to air pollution when you are outside?',
                        choices: ["I don't know",'Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q16_2',
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
    // Page 17. EFFECTIVENESS AIR PURIFIERS
    stager.extendStep('q17', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q17',
            options: {
                mainText: 'Think about an air purifier or particle filter.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q17_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is using an air purifier constantly in reducing your exposure to air pollution when you are indoors?',
                        choices: ["I don't know",'Completely ineffective','Not very effective','Somewhat effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_2',
                        orientation: 'V',
                        mainText: 'In your situation, how <em>costly</em> do you think it would be to purchase a new air purifier?',
                        choices: ["I don't know",'Not too costly','Somewhat costly','Very costly'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_3',
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
    // Page 18. Worried about pollution
    stager.extendStep('q18', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q18',
            options: {
                mainText: '<strong>Think about all the people in your network, such as family, friends, and coworkers.<strong>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q18_1',
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
    // Page 19. Nr household members + HH INCOME
    stager.extendStep('q19', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q19',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q19_1',
                        mainText: 'How many people usually live in your household?<br>',
                        hint: '(Think about all the people that live at least 8 month per year in your house. Answer should include yourself in the count.)',
                        width: '100%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q19_2',
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
    // Page 20. Education
    stager.extendStep('q20', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q20',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q20_1',
                        orientation: 'V',
                        mainText: 'What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','Bachelor degree University','Masters degree University','Doctoral degree','Professional Degree (JD, MD, MBA)'],
                        shuffleChoices: false,
                        requiredChoice: req
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 21: Age and gender
    stager.extendStep('q21', {
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
            id: 'q21',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q21_1',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+'],
                        requiredChoice: req
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q21_2',
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
    // Page 22. INCOME RANKING
    stager.extendStep('q22', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q22',
            options: {
                mainText: '<strong>Think about all the people living in your village/town/city.</strong> ',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q22_1',
                        mainText: 'In your opinion, what PERCENTAGE of the population living in your village/town/city has a LOWER annual income?<br>',
                        hint: 'Please give your answer as a PERCENTAGE in the 0 - 100 range.',
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


    // FEEDBACK
   stager.extendStep('feedback', {
        widget: {
            name: 'Feedback',
            options: {
                title: false,
                panel: false,
                minChars: 50,
                showSubmit: false,
                mainText: 'Thank you for participating. This was a pilot of ' +
                    'the main study, therefore we are very interested in ' +
                    'hearing your <strong>feedback</strong> about the ' +
                    'following points:<br/><br/><em><ol>' +
                    '<li>Was the survey too long or too short?</li>' +
                    '<li>Did you feel you could express your opinion?</li>' +
                    '<li>Did we leave out any important question?</li>' +
                    '<li>Did you find any question unclear or ' +
                    'uncomfortable?</li>' +
                    '<li>Did you experience any technical difficulty?</li>' +
                    '<li>How can we improve the study?</li></ol>'
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////////
    // END OF SURVEY
    //////////////////////////////////////////////////////////////////////////////
    stager.extendStep('end', {
        widget: {
            name: 'EndScreen',
            options: {
                feedback: false
            }
        },
        init: function() {
            node.game.doneButton.destroy();
        }
    });
};
