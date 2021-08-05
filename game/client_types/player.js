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

        this.visualRound = node.widgets.append('VisualRound', header, {
             displayMode: [
                 //'COUNT_UP_STAGES_TO_TOTAL',
                  'COUNT_UP_STEPS_TO_TOTAL'
             ]
         });

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

    stager.extendStep('effort_slider', {
        // donebutton: false,
        frame: 'effort.html',
        done: function() {
            return { effort: node.game.correct };
        },
        exit: function() {
            node.game.slider.destroy();
            node.game.slider = null;
            node.game.correct = null;
        },
        cb: function() {
            // variable to count correct answer
            var correct = 0;
            node.game.correct = correct;

            var n = 0;
            var m = 100; // Keep 100 else it does not work.

            function genrand() {
                var rnd = J.randomInt(n+10, m-9); // Avoid extremes.

                // Find a random initial position not too close to target.
                var initialValue = J.randomInt(n-1, m);
                while (Math.abs(rnd - initialValue) < 20) {
                    initialValue = J.randomInt(n-1, m);
                }

                if (node.game.slider) {
                    // TODO: find a way to re-init instead of destroy.
                    node.game.slider.destroy();
                }
                node.game.slider = node.widgets.append('Slider', 'input-div', {
                    id: 'slider',
                    mainText: 'Move the slider to position ' +
                              '<span style="font-size: larger">' + rnd +
                              '</span> and press submit.',
                    type: 'flat', // or 'volume'
                    min: n,
                    max: m,
                    initialValue: initialValue,
                    correctValue: rnd,
                    displayNoChange: false,
                    required: true,
                    texts: {
                        currentValue: function(widget, value) {
                            return '<strong>Position</strong>: ' + value;
                        }
                    }
                });
                // Fix bug.
                node.game.slider.correctValue = rnd;

            }

            genrand(n, m);

            var button;
            button = W.gid('submitAnswer');
            button.onclick = function() {
                var values = node.game.slider.getValues();
                var message1;
                var message2;

                if (values.isCorrect) {
                    message1 = 'The answer is <strong>correct</strong>.';
                    node.game.correct += 1;
                    message2 = 'So far, you had '+ node.game.correct
                             + ' correct sliders.';
                }
                else {
                    message1 = 'The answer is <strong>wrong</strong>.';
                    message2 = 'So far, you had ' + node.game.correct +
                               ' correct sliders.';
                }
    //                alert(message);
                // Hide element with id above.
                // Show element with id results.
                // Set innerHTML property of element with id textresult to
                // the value correct or wrong and how many table done so far.

                // hint: W.show and W.hide
                W.hide('above');
                W.show('results');
                W.setInnerHTML('CheckAnswer', message1);
                W.setInnerHTML('TotalPoint', message2);
                genrand(n, m);
            };

            var button2;
            button2 = W.gid('nextTable');
            button2.onclick = function() {
                // Hide element with id results.
                // Show element with id above.
            W.hide('results');
            W.show('above');
            };
        },

    });

    stager.extendStep('effort_count', {
        // donebutton: false,
        frame: 'effort.html',
        done: function() {
            return { effort: node.game.correct };
        },
        exit: function() {
            node.game.zero.destroy();
            node.game.zero = null;
            node.game.correct = null;
        },
        cb: function() {
            var box = W.gid('box');
            // variable to count correct answer
            var correct = 0;
            node.game.correct = correct;


            //show effort task
            // Number of numbers for each line
            var n = 5;
            // Number of lines
            var m = 4;
            // Initialize count of zeros
            var zeros = 0;
            function genrand(n,m) {
                box.innerHTML = '';
                zeros = 0;
                // Build a multidimensional array
                for (var i = 0; i < m; i++) {
                    // Generate random sequence
                    var rand = Array(n).fill().map(() => Math.floor(Math.random()*2));
                    // Add div
                    var myDiv = document.createElement("div");
                    // Add the sequence to div
                    myDiv.innerHTML = rand.join(' ');
                    // Display sequence
                    box.appendChild(myDiv);
                    // number of zeros
                    for (var j = 0; j < n; j++) {
                        if (rand[j] === 0) {
                            zeros += 1;
                        }
                    }
                }

                if (!node.game.zero) {
                    node.game.zero = node.widgets.append('CustomInput', 'input-div', {
                        id: 'zero',
                        mainText: 'How many zeros are there?',
                        type: 'int',
                        min: 0,
                        max: 50,
                        requiredChoice: true
                    });
                }
                else {
                    node.game.zero.reset();
                }
            }

            genrand(n,m);

            var button;
            button = W.gid('submitAnswer');
            button.onclick = function() {
                var count = node.game.zero.getValues().value;
                var message1;
                var message2;
                if (count === zeros) {
                    message1 = 'The answer is correct.';
                    node.game.correct += 1;
                    message2='So far, you had '+ node.game.correct+ ' correct tables';
                }
                else {
                    message1 = 'The answer is wrong.';
                    message2='So far, you had '+ node.game.correct+ ' correct tables';
                }
//                alert(message);
                // Hide element with id above.
                // Show element with id results.
                // Set innerHTML property of element with id textresult to
                // the value correct or wrong and how many table done so far.

                // hint: W.show and W.hide
                W.hide('above');
                W.show('results');
                W.setInnerHTML('CheckAnswer', message1);
                W.setInnerHTML('TotalPoint', message2);
                genrand(n,m);
            };

            var button2;
            button2 = W.gid('nextTable');
            button2.onclick = function() {
                // Hide element with id results.
                // Show element with id above.
            W.hide('results');
            W.show('above');
            };
        },

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
                        mainText: 'What is your favorite color? Write the answer in the language you selected above.',
                        width: '100%',
                        requiredChoice: true,
                    },
                    {
                        name: 'CustomInput',
                        id: 'q1_4',
                        mainText: 'You selected two languages. What is the name of your favorite color in the second language you selected above?',
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
                        mainText: 'Do you live in a village or a town/city?',
                        choices: [ 'Village', 'Town/city'],
                        shuffleChoices: true,
                        requiredChoice: true
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
                        mainText: 'What <em>other</em> serious problem do you think is missing from the list above?',
                        width: '100%',
                        requiredChoice: false
                    }
                ],
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 5. WORK: Commute
        stager.extendStep('q5', {
            cb: function() {
                W.cssRule('table.choicetable { ' +
                'border-collapse: separate; border-spacing: 10px }');
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
                                var w1, w2, forms, len;
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
                            orientation: 'H',
                            choicesSetSize: 2,
                            mainText: 'In which sector do you work?',
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
                                len = forms.q5_2.choices.length - 1;
                                w = forms.q5_3;
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
                            mainText: 'During work, where do you spend most of your time?',
                            choices: ['Inside a building/office with walls',
                            'In a place with a roof but no walls',
                            'Outside',
                            'Driving',
                            'Other'],
                            shuffleChoices: false,
                            hidden: true,
                            requiredChoice: true,
                            onclick: function(value, removed) {
                                var w, forms, len;
                                forms = node.widgets.lastAppended.formsById
                                len = forms.q5_4.choices.length - 1;
                                w = forms.q5_5;
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
                node.widgets.lastAppended.formsById.q6_2.show();
            }
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
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
                        mainText: 'At work, is there an air conditioner (AC)?',
                        choices: ['No', 'Yes',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q6_2',
                        orientation: 'H',
                        mainText: 'At work, is there an air purifier or particle filter?',
                        choices: ['No', 'Yes',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: true
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 7. HOME environment
    stager.extendStep('q7', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
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
                        mainText: 'What do you use as lighting fuel at home?<br>',
                        choices: [ 'Kerosene','Electricity','Gas','Solar lamp','Other'],
                        hint: '(Select <em><strong>all</strong></em> that apply.)',
                        shuffleChoices: false,
                        selectMultiple: 4,
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
                        name: 'CustomInput',
                        id: 'q7_2',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q7_3',
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
                            len = forms.q7_3.choices.length - 1;
                            w1 = forms.q7_4;
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
                        id: 'q7_4',
                        mainText: 'Which other?',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q7_5',
                        orientation: 'V',
                        mainText: 'In your home, is cooking done in a separate room?',
                        choices: ['No, cooking is done in the main living area.','Yes, cooking is done in a separate kitchen.'],
                        shuffleChoices: true,
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
                        id: 'q8_1',
                        orientation: 'H',
                        mainText: 'Do you own an air conditioner (AC)?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_2',
                        orientation: 'H',
                        mainText: 'Do you own an air purifier or particle filter?',
                        choices: ['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        hidden: false
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q8_3',
                        orientation: 'H',
                        mainText: 'When you are home, do you do something to reduce your own exposure to air pollution?',
                        choices:['No','Yes'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q8_3.choices.length - 1;
                            w1 = forms.q8_4;
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
                        id: 'q8_4',
                        orientation: 'V',
                        mainText: 'What do you do to reduce air pollution in your home?',
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
                mainText: '<em>Think about all the time you are OUTDOORS, that is when you are outside in the open air, for example on the street talking to people, going to the market, going for a walk, etc.',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q9_1',
                        mainText: 'What can you do to reduce how pollution impacts you when you are OUTDOORS?',
                        //hint: "Write <em>'Nothing'</em> if there is nothing you can do to reduce your own exposure to air pollution while outdoors.",
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
                mainText: '<em>How much do you agree with the following statement?<em>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q10_1',
                        orientation: 'H',
                        mainText: '"Air pollution is present only if you can see it".',
                        choices: ["I don't know",'Strongly disagree','Disagree','Neutral','Agree','Strongly agree'],
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
                        mainText: 'In the past 5 years, did a member of your close family or friends (not yourself) have any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to say'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 5
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
                        mainText: 'In the past 5 years, did YOU have any of the following health conditions?<br>',
                        hint: 'Select <strong><em>all</strong></em> that apply.',
                        choices: ["Allergies",'High blood pressure','Heart disease','Lung disease','Diabetes','None','Prefer not to say'],
                        shuffleChoices: false,
                        requiredChoice: true,
                        selectMultiple: 5,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q12_2',
                        orientation: 'H',
                        mainText: 'Do you smoke tobacco (cigarettes, hookah, bidi, etc.)?',
                        choices: [ 'Yes','No'],
                        shuffleChoices: false,
                        requiredChoice: true
                    }
                ]
            }
        }
    });



    //////////////////////////////////////////////////////////////////////////
    // Page 13. Pollution information
    stager.extendStep('q13', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: center !important; ' +
            'font-weight: normal; padding-left: 10px; }');
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
                        mainText: "Think about the cities with the <strong>lowest air pollution</strong> and the city with the <strong>highest air pollution</strong> in the world.<br/><br> How does YOUR village/town/city rank on a scale from 1 to 7, where 1 means \"lowest pollution\" and 7 means \"highest pollution\"?",
                        choices: J.seq(1,7),
                        shuffleChoices: false,
                        requiredChoice: true,
                        left: "Lowest pollution",
                        right: "Highest pollution"
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 14. Pollution IMPACTS on PEOPLE
    stager.extendStep('q14', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
            'font-weight: normal; padding-left: 10px; }');
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
                        mainText:'Which parts of life are impacted by air pollution?',
                        hint: 'Select <em><strong>all</em></strong> that apply.',
                        choices: ["Productivity at work or at home","Health","Body weight","Income","Food quality","School performance","Marriage/dating success","Civil violence","None","Other"],
                        shuffleChoices: true,
                        requiredChoice: true,
                        selectMultiple: 8,
                        onclick: function(value, removed) {
                            var w1, forms, len;
                            forms = node.widgets.lastAppended.formsById
                            len = forms.q14_1.choices.length - 1;
                            w1 = forms.q14_2;
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
                        id: 'q14_2',
                        orientation: 'V',
                        mainText: 'Please specify.',
                        width: '100%',
                        hidden: true,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 15. Impact on your health
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
                        mainText:'Think about YOUR everyday exposure to air pollution. In your situation, how large or small is the impact of air pollution on your HEALTH?',
                        choices: [ 'No impact','Small','Medium','Large','Extremely large',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });


    //////////////////////////////////////////////////////////////////////////
    // Page 16. Pollution exposure comparison
    stager.extendStep('q16', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q16',
            options: {
                mainText: 'Think about your own exposure to air pollution compared to the exposure of other people living in your area. <br>- For example, some people work outside and other people work in an office. <br>- Some people spend a lot of time in traffic during high pollution hours, others avoid it.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q16_1',
                        orientation: 'V',
                        //mainText: 'How do you rate your own exposure to air pollution compared to the exposure of others in your village/town/city?',
                        mainText: "Compared to the people living in your village/town/city, are YOU more or less exposed to air pollution?",
                        choices: ['I am much more exposed','I am a bit more exposed','I am exposed the same','I am a bit less exposed','I am much more exposed',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 17. EFFECTIVENESS MASKS
    stager.extendStep('q17', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q17',
            options: {
                mainText: 'Think about a typical face mask.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q17_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is wearing a clean face mask in reducing your exposure to air pollution when you are outside?',
                        choices: ["I don't know",'Completely ineffective','A little bit effective','Very effective'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_2',
                        orientation: 'V',
                        mainText: 'How comfortable do you feel when wearing a face mask outside?',
                        choices: ["Very uncomfortable",'A bit uncomfortable','A bit comfortable','Very comfortable'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q17_3',
                        orientation: 'V',
                        mainText: 'Can you afford to purchase new face masks so you can wear a clean mask every time you go outside?<br>',
						hint: 'The price of a new face mask is less than INR 5.',
                        choices: ['Yes','Yes, but I think they are too expensive','No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 18. EFFECTIVENESS AIR PURIFIERS
    stager.extendStep('q18', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q18',
            options: {
                mainText: 'Think about an air purifier or particle filter.',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q18_1',
                        orientation: 'V',
                        mainText: 'In your opinion, how <em>effective</em> is using an air purifier in reducing air pollution indoors?',
                        choices: ['Completely ineffective','A little bit effective','Very effective',"I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q18_2',
                        orientation: 'V',
                        mainText: 'Can you afford to purchase a new air purifier?<br>',
						hint: 'The cost of an air purifier is about INR 10,000 to INR 15,000.',
                        choices: ['Yes', 'Yes, but I think it is too expensive', 'No'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q18_3',
                        orientation: 'V',
                        mainText: 'Can you afford to pay for the electricity that an air purifier consumes when it is constantly switched on?',
                        choices: ['Yes', 'No', "I don't know"],
                        shuffleChoices: false,
                        requiredChoice: true,
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 19. Pollution news
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
                        name: 'ChoiceTable',
                        id: 'q19_1',
                        orientation: 'H',
                        mainText: 'How often do you read or hear news about air pollution in the place where you live?',
                        choices: ["Never",'Less than once a month','A few times each month','Every week','Every day'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 20. Worried about pollution
    stager.extendStep('q20', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q20',
            options: {
                mainText: '<strong>Think about all the people in your network, such as family, friends, and coworkers.<strong>',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q20_1',
                        orientation: 'H',
                        mainText: 'How <em>worried</em> are the people in your network about air pollution in your village/town/city?',
                        choices: ["I don't know",'Not worried at all','A little worried','Very worried'],
                        shuffleChoices: false,
                        requiredChoice: true,
                    }
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 21. Nr household members + HH INCOME
    stager.extendStep('q21', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q21',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q21_1',
                        mainText: 'How many people live in your household?<br>',
                        hint: '(Think about everyone that lives at least 8 month per year in your house. Answer should include yourself in the count.)',
                        width: '100%',
                        type: 'int',
                        requiredChoice: true,
                        min: 1
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q21_2',
                        orientation: 'V',
                        mainText: '<strong>In 2020, what was the annual income of your household?</strong><br>',
                        hint: 'Please refer to the <strong>total income</strong> of ALL members living in your household in 2020. By household annual income, we mean the total sum of incomes earned in your household in 2020, before any taxes or deductions. This includes wages and salaries from all jobs, pension income, any investment and business income, or unemployment benefits.',
                        //choices: [ 'Less than 5,000 USD', '5,000 - 7,500 USD', '7,500 - 10,000 USD', '10,000 - 12,500 USD', '12,500 - 15,000 USD', '15,000 - 25,000 USD','25,000 - 50,000 USD','More than 50,000 USD'],
                        choices: ['Less than 2,50,000 INR',' 2,50,000 INR – 5,00,000 INR','5,00,000 INR – 1,00,00,000 INR','1,00,00,000 INR – 1,50,00,000 INR','1,50,00,000 INR – 2,00,00,000 INR','2,00,00,000 INR – 3,00,00,000 INR','3,00,00,000 INR – 4,00,00,000 INR','4,00,00,000 INR or more'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 22. Education
    stager.extendStep('q22', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q22',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q22_1',
                        orientation: 'V',
                        mainText: 'What is the highest educational level that you have completed?',
                        choices: ['No formal education','Primary school','Secondary school','Vocational training','Bachelor degree University','Masters degree University','Doctoral degree','Professional Degree (JD, MD, MBA)'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                ]
            }
        }
    });

    //////////////////////////////////////////////////////////////////////////
    // Page 23: Age and gender
    stager.extendStep('q23', {
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
            id: 'q23',
            options: {
                mainText: '',
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'q23_1',
                        mainText: 'What is your age group?',
                        choices: [ '18-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71+'],
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q23_2',
                        mainText: 'What is your gender?',
                        choices: [ 'Female', 'Male', 'Other'],
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
    // Page 24. INCOME RANKING
    stager.extendStep('q24', {
        cb: function() {
        },
        // Make a widget step.
        widget: {
            name: 'ChoiceManager',
            id: 'q24',
            options: {
                mainText: '<strong>Think about all the people living in your village/town/city.</strong> ',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'q24_1',
                        mainText: 'In your opinion, what PERCENTAGE of the population living in your village/town/city has a HIGHER annual income than you?<br>',
                        hint: 'Please give your answer as a PERCENTAGE (between 0 and 100).',
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
    // Page 25. Life satisfaction
    stager.extendStep('q25', {
        cb: function() {
            W.cssRule('table.choicetable td { text-align: left !important; ' +
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
                        id: 'q25_1',
                        orientation: 'V',
                        mainText: 'Taking all things together, would you say you are',
                        choices: ['Very happy','Rather happy','Not very happy','Not at all happy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'q25_2',
                        orientation: 'V',
                        mainText: 'How healthy do you feel these days?',
                        choices: ['Very healthy','Healthy','Neutral','A bit unhealthy','Very unhealthy'],
                        shuffleChoices: false,
                        requiredChoice: true
                    },
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
