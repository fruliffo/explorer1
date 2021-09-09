# explorer1
Anca <anca.balietti@gmail.com>

## Description

First stage survey Explorer

## TODO CONDITIONAL QUESTION

- Put pollution data in private/ folder

- Inside game/game.setup.js load pollution data.
    - Create a new NDDB database
    - Load into the database the csv or JSON file with pollution data,
    - For details see:  https://github.com/nodeGame/NDDB
    - If multiple files can use v7 loadDir() (not documented).
    - Store the db with inside the setup object to make it available to logic.

- In file game/client_types/logic.js, in the init function

    - Define a new index in the memory database that maps player ids to their answer to 'survey.q3'.
    ```js
    // Create index.
    memory.index('districts', (msg) => {
        // Skip answers from other steps.
        if (msg.stepId !== 'q3') return;
        let playerId = msg.from;
        return playerId;
    });
    ```

    - Define a listener to GET messages that responds with the pollution info.
    ```js
    node.on('get.pollinfo', (msg) => {
        let q3Answers = memory.districts.get(msg.from);

        // Use the answer to q3 to find the relevant pollution info in the
        // database stored in setup.
        //
        let pollutionInfo = 50;

        // Return it.
        return pollutionInfo;
    })

- In file game/client_types/player.js, in the step in which pollution info is required:

    ```js
    node.get('pollinfo', function(pollinfo) {
        // Do something with the data, e.g.:
        W.setInnerHTML('Id_of_html_tag', 'Your pollution is: ' + pollinfo);
        // Must create an element (e.g. a <div> or a <span>) with that id)
        // in the frame of the page.
    });
    ```

- For details about get messages see: https://github.com/nodeGame/nodegame/wiki/Data-Exchange-Examples-v6



## License

[MIT](LICENSE)
