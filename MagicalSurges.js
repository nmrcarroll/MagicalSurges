/*
MagicalSurges
Version 0.0.3
Github https://github.com/nmrcarroll/roll20-api-scripts/tree/master/MagicalSurges
*/

var MagicalSurges = MagicalSurges || (function(){
  'use strict';

  var version = '0.0.3',
  surgeTable,
  arrayTable,

  checkInstall = function(){

    if(!state.MagicalSurges){
      state.MagicalSurges = {
        sorc: [],
        count: 0,
        testing: []
      };
    };



    surgeTable = findObjs({
        type: "rollabletable",
        name: "MagicalSurges"
    })[0];
    if (!surgeTable){
      surgeTable = createObj("rollabletable", {
          name: "MagicalSurges"
      });
      createObj('tableitem',{
          name: 'Default surge',
          rollabletableid: surgeTable.id
      });
    }
    arrayTable = findObjs({type: 'tableitem', rollabletableid: surgeTable.id});
  },

  loadTable = function(obj){
    if(obj.get("_rollabletableid") == surgeTable.id){
      arrayTable = findObjs({type: 'tableitem', rollabletableid: surgeTable.id});
    }
  },

  addPlayer = function(obj){
    var character = findObjs({type: 'character', name: obj});
    if(character.length > 0){
        state.MagicalSurges.sorc.push(obj);
        sendChat('MagicalSurges', "/w gm Added " + obj + ", you currently have " + state.MagicalSurges.sorc + " in your list.")
    }
    else{
      sendChat('MagicalSurges', "/w gm Could not find player named '" + obj + "' please make sure to use the exact same name as on the characters handout.");
    };
  },

  removePlayer = function(obj){
    var index = state.MagicalSurges.sorc.indexOf(obj);
    if(index != -1){
      state.MagicalSurges.sorc.splice(index,1);
      sendChat('MagicalSurges', "/w gm Removed " + obj + ", you currently have " + state.MagicalSurges.sorc + " in your list.")
    }
    else{
      sendChat('MagicalSurges', "/w gm Could not find player named '" + obj + "' in the list. You do have : " + state.MagicalSurges.sorc);
    };
  },

  makeSurge = function(){
    var roll = randomInteger(arrayTable.length);
    log(roll);
    var effect = arrayTable[roll-1].get("name");
    var chatMesg = "";
    chatMesg = '&{template:atk} {{rname=WildRoll}} {{rnamec=rnamec}} {{r1='+ roll + '}} {{normal=1}} {{desc=' + effect + '}}';
    return chatMesg;
  },

  handleInput = function(msg){
    var args;
    if (msg.type !== "api") {
      if(msg && msg.rolltemplate && (msg.rolltemplate === 'spell' || msg.rolltemplate === 'atk' || msg.rolltemplate === 'dmg' || msg.rolltemplate === 'atkdmg')){
            let character_name = msg.content.match(/charname=([^\n{}]*[^"\n{}])/);
            log(msg);
            character_name = RegExp.$1;
            log(character_name);
            var allowed_characters = state.MagicalSurges.sorc;
            log(allowed_characters);
            log(allowed_characters.includes(character_name));
            //Check if the caster is on the allowed list of characters.
            if(allowed_characters.includes(character_name)){
                let spell_level = msg.content.match(/spelllevel=([^\n{}]*[^"\n{}])/);
                //Make sure we're not pulling from the first regex
                if(spell_level != null){
                    spell_level = RegExp.$1;
                }
                let cantrip = msg.content.includes("cantrip}}")
                let whisper = msg.target;
                //If a spell was rolled, automatically roll a d20 to see if a surge happens
                var roll = randomInteger(20);
                //Check if the roll is actually a spell and not a cantrip or other attack
                if(!cantrip && (spell_level > 0 || msg.rolltemplate == 'spell') ){
                    var chatMesg = "";
                    chatMesg = '&{template:simple} {{rname=Wild}} {{r1='+ roll + '}} {{normal=1}}';
                if(whisper==undefined){
                    sendChat(msg.who, chatMesg);
                }
                else{
                    sendChat(msg.who,"/w gm " + chatMesg);
                    sendChat(msg.who,"/w " + msg.who + " " + chatMesg);
                }
                //If a 1 was rolled for the surge output a surge automatically.
                if(roll == 1){
                    let mSurge = makeSurge();
                    if(whisper==undefined){
                        sendChat(msg.who, mSurge);
                    }
                    else{
                        sendChat(msg.who,"/w gm " + mSurge);
                        sendChat(msg.who,"/w " + msg.who + " " + mSurge);
                    }
                }
             }
            }

       }
    };
    args  = msg.content.split(/\s+/);
    switch(args[0]){
      case '!MagicalSurge':
        if(args.length === 1){
          sendChat(msg.who, "/direct " + makeSurge());
          break;
        }
        switch(args[1]){
          case 'gm':
            sendChat(msg.who, "/w gm " + makeSurge());
            break;
          case 'add':
            if(args.length > 2){
              var name = args.slice(2);
              var name = name.join(" ");
              var character = findObjs({type: 'character', name: name});
              if(playerIsGM(msg.playerid)){
                addPlayer(name);
                break;
              }
                break;
            }
          case 'remove':
            if(args.length > 2){
              var name = args.slice(2);
              var name = name.join(" ");
              if(playerIsGM(msg.playerid)){
                removePlayer(name);
                break;
              }
              break;
            }
          }
    }
  },
  registerEventHandlers = function(){
    on('chat:message', handleInput);
    on('add:tableitem', loadTable);
    on('change:tableitem', loadTable);
    on('destroy:tableitem', loadTable);
  };
  return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};

}());

on('ready',function(){
  'use strict';

  MagicalSurges.CheckInstall();
  MagicalSurges.RegisterEventHandlers();

});
