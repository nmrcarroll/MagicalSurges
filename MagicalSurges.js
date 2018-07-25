/*
MagicalSurges
Version 0.0.4
Github https://github.com/nmrcarroll/roll20-api-scripts/tree/master/MagicalSurges
*/

var MagicalSurges = MagicalSurges || (function () {
  let version = '0.0.5',
    surgeTable,
    arrayTable,

    checkInstall = function () {
      // initalize the state to store our sorcerers in if not already done.
      if (!state.MagicalSurges) {
        state.MagicalSurges = {
          sorc: [],
        };
      }


      // Attempt to locate the rollable table
      surgeTable = findObjs({
        type: 'rollabletable',
        name: 'MagicalSurges',
      })[0];
      // If rollable table does not exist, make one.
      if (!surgeTable) {
        surgeTable = createObj('rollabletable', {
          name: 'MagicalSurges',
        });
        // Create a dummy item in the rollable table.
        createObj('tableitem', {
          name: "DELETE ME WHEN YOU'VE ADDED YOUR OWN SURGES",
          rollabletableid: surgeTable.id,
        });
      }
      // store all the items in the rollable table for later use.
      arrayTable = findObjs({
        type: 'tableitem',
        rollabletableid: surgeTable.id,
      });
    },

    // called when changes are made to the rollable table, reloads the list we have stored.
    loadTable = function (obj) {
      if (obj.get('_rollabletableid') == surgeTable.id) {
        arrayTable = findObjs({
          type: 'tableitem',
          rollabletableid: surgeTable.id,
        });
      }
    },
    // adds player id to the state
    addPlayer = function (ids) {
      state.MagicalSurges.sorc = [...new Set([...state.MagicalSurges.sorc, ...ids])];
    },

    // remove player id from the state
    removePlayer = function (ids) {
      state.MagicalSurges.sorc = state.MagicalSurges.sorc.filter(id => !ids.includes(id));
    },

    idNameConvert = function (charNames, args) {
      // Remove all spaces from string.
      const keyFormat = n => (n || '').toLowerCase().replace(/\s+/g, '');
      const allCharIds = [];
      const charId2Name = {};

      // Creates a dictionary of all characters and their ID's
      const charKey2Id = findObjs({
        type: 'character',
      }).reduce((m, c) => {
        const name = c.get('name');
        m[keyFormat(name)] = c.id;
        allCharIds.push(c.id);
        charId2Name[c.id] = name;
        return m;
      }, {});

      // find id matching character name entered or id entered
      const ids = charNames.reduce((m, n) => {
        const kn = keyFormat(n);
        if (charKey2Id.hasOwnProperty(kn)) {
          m.push(charKey2Id[kn]);
        }
        return m;
      }, args.slice(2).filter(id => allCharIds.includes(id)));
      return [ids, charId2Name];
    },

    // Checks if the message is a spell from one of our monitored characters
    checkSpell = function (msg) {
      const character_id = (findObjs({
        type: 'character',
        name: (msg.content.match(/charname=([^\n{}]*[^"\n{}])/) || [])[1],
      })[0] || {
        id: 'API',
      }).id;

      if (state.MagicalSurges.sorc.includes(character_id)) {
        let spell_level = msg.content.match(/spelllevel=([^\n{}]*[^"\n{}])/);
        // Make sure we're not pulling from the first regex
        if (spell_level != null) {
          spell_level = RegExp.$1;
        }
        const cantrip = msg.content.includes('cantrip}}');
        const whisper = msg.target;
        // If a spell was rolled, automatically roll a d20 to see if a surge happens

        if (!cantrip && (spell_level > 0 || msg.rolltemplate == 'spell')) {
          const roll = randomInteger(20);
          if (!cantrip && (spell_level > 0 || msg.rolltemplate == 'spell')) {
            let chatMesg = '';
            chatMesg = `&{template:simple} {{rname=Wild}} {{r1=${roll}}} {{normal=1}}`;
            if (whisper == undefined) {
              sendChat(msg.who, chatMesg);
            } else {
              sendChat(msg.who, `/w gm ${chatMesg}`);
              sendChat(msg.who, `/w ${msg.who} ${chatMesg}`);
            }
          }
        }
      }
    },

    makeSurge = function () {
      const roll = randomInteger(arrayTable.length);
      const effect = arrayTable[roll - 1].get('name');
      let chatMesg = '';
      chatMesg = `&{template:atk} {{rname=WildRoll}} {{rnamec=rnamec}} {{r1=${roll}}} {{normal=1}} {{desc=${effect}}}`;
      return chatMesg;
    },

    handleInput = function (msg) {
      const spellRollTemplates = ['spell', 'atk', 'dmg', 'atkdmg'];
      if (msg.type !== 'api') {
        if (msg && msg.rolltemplate && spellRollTemplates.includes(msg.rolltemplate)) {
          const roll = checkSpell(msg);
          const whisper = msg.target;
          if (roll == 1) {
            const mSurge = makeSurge();
            if (whisper == undefined) {
              sendChat(msg.who, mSurge);
            } else {
              sendChat(msg.who, `/w gm ${mSurge}`);
              sendChat(msg.who, `/w ${msg.who} ${mSurge}`);
            }
            return roll;
          }
        }
      }
      const charNames = msg.content.split(/\s+--/);
      const args = msg.content.split(/\s+/);
      // Check for specific script commands and respond
      switch (args[0]) {
        case '!MagicalSurge':
          if (args.length === 1) {
            sendChat('MagicalSurge', `/direct ${makeSurge()}`);
            break;
          }
          switch (args[1]) {
            case 'gm':
              sendChat('MagicalSurge', `/w gm ${makeSurge()}`);
              break;
            case 'add':
            case 'remove':
              if (playerIsGM(msg.playerid) && (args.length > 2 || charNames.length)) {
                const idReturn = idNameConvert(charNames, args);
                const ids = idReturn[0];
                const charId2Name = idReturn[1];
                if (ids.length) {
                  if (args[1] === 'add') {
                    sendChat('MagicalSurge', `/w gm Adding Characters: ${ids.map(id => charId2Name[id]).join(', ')}`);
                    addPlayer(ids);
                    sendChat('MagicalSurge', `/w gm Current Sorcerers: ${state.MagicalSurges.sorc.map(id => charId2Name[id]).join(', ')}`);
                  } else {
                    sendChat('MagicalSurge', `/w gm Removing Characters: ${ids.map(id => charId2Name[id]).join(', ')}`);
                    removePlayer(ids);
                    sendChat('MagicalSurge', `/w gm Current Sorcerers: ${state.MagicalSurges.sorc.map(id => charId2Name[id]).join(', ')}`);
                  }
                } else {
                  sendChat('MagicalSurge', '/w gm No valid characters found.  Please be sure to use the character_id or character name.');
                }
              }
          }
      }
    },
    registerEventHandlers = function () {
      on('chat:message', handleInput);
      on('add:tableitem', loadTable);
      on('change:tableitem', loadTable);
      on('destroy:tableitem', loadTable);
    };
  return {
    CheckInstall: checkInstall,
    RegisterEventHandlers: registerEventHandlers,
  };
}());

on('ready', () => {
  MagicalSurges.CheckInstall();
  MagicalSurges.RegisterEventHandlers();
});
