/*
MagicalSurges
Version 0.0.2
Github https://github.com/nmrcarroll/roll20-api-scripts/tree/master/MagicalSurges
*/

on('ready', () => {
  //Modify the constants below to fit your game

  // A comma seperated list of characters who use Wild Magic (Multiple characters: 'John,Jake,Aron').
  const CHARACTERS = 'Zarnof';
  //Custom magical surges in dictionary format
  const Surges = {
      "0001": "Roll twice on this table, ignoring this result. ",
      "0002": "You lose 2d8 Hit Points. Choose a creature within 60 feet to gain the same amount you lost. ",
      "0003": "You cast magic missile as a 2d4th level spell, spreading the missiles equally over all enemies within range. ",
      "0004": "Recoil! You and a target creature you can see within 60 feet of you must make a Dex save against your spell DC at the end of your turn or be knocked prone. ",
      "0005": "You cast gust of wind which lasts for 2d4 rounds and does not require concentration. ",
      "0006": "You cast haste on yourself that lasts for 2d4 rounds and does not require concentration. You are still negatively impacted when the spell ends. ",
      "0007": "You cast shatter as a 2nd level spell. ",
      "0008": "For the next minute the energy type of all your spells with an energy type is changed to fire. ",
      "0009": "You cast a copy of your last cast spell directed, following the range and target rules of the original spell. Cannot target original target. ",
      "0010": "You can take one additional action immediately, abiding by normal spellcasting rules. ",
      "0011": "You can teleport up to 60 feet to an unoccupied space you can see. ",
      "0012": "You cast 3 firebolts at 3 random creatures within range. ",
      "0013": "For the next minute, the range of all your spells are doubled. ",
      "0014": "Cast firebolt. ",
      "0015": "Cast firebolt on yourself. ",
      "0016": "Cast firebolt on yourself and up two other creatures.  ",
      "0017": "For one hour, gain the effects of Eagle's Splendor as if by the enhance ability spell. ",
      "0018": "Choose one: You take 2d10 necrotic damage or cast Deafness on yourself as if from the Blindness/Deafness spell ",
      "0019": "Choose one: You take 3d10 necrotic damage or cast Blindness on yourself as if from the Blindness/Deafness spell. ",
      "0020": "Choose one: You take 4d10 necrotic damage or cast Blindness and Deafness on yourself as if from the Blindness/Deafness spell. ",
      "0021": "You lose a spell slot of 1d(highest spell level) taking the next highest spell slot if rolled slot is not available",
      "0022": "You cast Armor of Agathys on yourself as a 1d4th level spell. ",
      "0023": "You cast arms of Hadar as a 1d4th level spell. ",
      "0024": "Your next spell cast that would use a spell slot is free, but you are silenced for 1d(spell level) rounds after casting it. ",
      "0025": "You regain 1d4 sorcery points. ",
      "0026": "For the next minute you can concentrate on 2 spells at once, but you lose Hit Points equal to the highest spell level maintained at the start of each of your turns if you do. You make separate concentration rolls when taking damage if you're concentrating on 2 spells. ",
      "0027": "You regain all expended sorcery points. ",
      "0028": "You cast blur on yourself which lasts for 3 rounds and does not require concentration. ",
      "0029": "Roll 1d2. On a 1 you cast slow on yourself that lasts for 2 rounds. On a 2 you cast haste on yourself that lasts for 2 rounds. Neither requires concentration. ",
      "0030": "You cast inflict wounds at the 1st level. If no creatures are in range, cast it on yourself. ",
      "0031": "You have advantage on your next attack or spell attack roll. ",
      "0032": "You have disadvantage on your next attack or spell attack roll. ",
      "0033": "You and a target creature you can see within 60 feet make contested Cha checks, the loser is charmed until the end of their next turn. ",
      "0034": "You cast ray of frost on yourself. ",
      "0035": "You cast ray of enfeeblement at the 2nd level on an ally within range. If it hits, it lasts the full duration and does not require concentration. ",
      "0036": "You cast ray of sickness at the 1st level on yourself. ",
      "0037": "You cast misty step. ",
      "0038": "For the next minute all of your spells are cast as if effected by the Empowered Spell metamagic. ",
      "0039": "The next instance of damage you deal, you double the damage dice against a single creature. You take half the damage before doubling the dice. ",
      "0040": "For the next minute you can teleport up to 20 feet as a bonus action on each of your turns. ",
      "0041": "You become poisoned for 1d4 hours. ",
      "0042": "You cast fireball as a third level spell centered on yourself, as if effected by the Careful Spell metamagic. ",
      "0043": "You cast Blink. ",
      "0044": "For the next minute all your spells with a casting time of 1 action have a casting time of 1 bonus action. ",
      "0045": "Maximize the damage of the next spell you cast within a minute. ",
      "0046": "You lose 1d[#max sorcery points). If you lose more than you currently have, you take 1d4 Necrotic damage for each point over. Then, for each point lost you heal 1d4 spread over anyone within 30 feet besides yourself. ",
      "0047": "You regain 2d10 Hit Points. ",
      "0048": "You regain your lowest level expended spell slot. ",
      "0049": "For the next minute your proficiency bonus is doubled when attacking or forcing enemies to make saves against your spell DC, but your own saving throws and AC are reduced by your normal proficiency bonus. ",
      "0050": "You may select any result from this table. ",
      "0051": "You gain 1d6 to all saving throws for 10 minutes, rolled on every save. ",
      "0052": "You lose 1d6 to all saving throws for 10 minutes, rolled on every save. ",
      "0053": "All allies within 20' of you get a -2 to Attack, Spell Attack, and Damage rolls for any ranged attack for 1 minute. ",
      "0054": "One creature of your choice within 60' has -1 to Attack, Spell Attack, and Damage rolls and AC for 1 minute. ",
      "0055": "You and all creatures within 60' of you gain vulnerability to fire damage for one minute. ",
      "0056": "Each creature within 30' of you takes 1d10 necrotic damage. You regain hit points equal to the total damage dealt. ",
      "0057": "All creatures besides you cannot hear any sound you make and you gain advantage on Dex (Stealth) checks for 1 minute. ",
      "0058": "A random creature within 30' of you gains a flying speed equal to its walking speed for 1 minute. ",
      "0059": "You immediately gain 20 temporary hit points. ",
      "0060": "You gain vulnerability to all damage but damage you do treats resisted damage as normal, and normal damage as the target having vulnerability for 1 minute. ",
      "0061": "The next spell you cast within 1 minute that does damage, the damage is minimized. ",
      "0062": "You gain a spectral shield that grants you +2 AC and immunity to magic missile for 1 minute. ",
      "0063": "A random demon whose CR is equal to your level divided by 2 (round down) appears within 30' of you. Make a Cha saving throw against your own spell save DC. If you make it, the demon is subservient, otherwise it has free will (DM controlled). The demon remains for 4d4 rounds. ",
      "0064": "You have advantage on all rolls you make where you don't already have advantage for 2d6 rolls or until you finish a long rest.",
      "0065": "All creatures within 60' of you regain 2d8 hit points. ",
      "0066": "A stat chosen by 1d6 is increased by 4 for one minute. ",
      "0067": "You have disadvantage on all rolls you make where you don't already have disadvantage for 2d6 rolls or until you finish a long rest. ",
      "0068": "You gain +2 to AC for one minute. ",
      "0069": "You cast Wall of Fire centered on yourself with a radius of 15 feet pointing outwards. It remains for 1 minute and does not require concentration. ",
      "0070": "You and all allies within 30' of you gain +2 AC for 1 minute. ",
      "0071": "You and all allies within 30' of you lose -2 AC for 1 minute. ",
      "0072": "You cast Faerie Fire with a 20' radius centered on yourself. ",
      "0073": "You gain 5 hit points at the beginning of your turn for 1 minute. ",
      "0074": "You and all creatures within 30' of you gain +20' movement speed for 1 minute. ",
      "0075": "You gain +1 maximum spell slot for your highest Sorcerer spell slot for the next 1d6 days. Other wild surges cannot effect that spell slot. ",
      "0076": "Subtract 1d4 from all ability rolls for the next 1 minute. ",
      "0077": "One creature you can see gains or loses up to 1d4 to their Attack rolls, Spell Attack rolls, and AC for 1 minute. You lose proficiency total and AC equal to the amount that creature gained or lost for 1 minute. ",
      "0078": "You cast Spiritual Weapon at the 1st level. ",
      "0079": "You recover 1 your highest expended spell slot. ",
      "0080": "You trade a spell slot of level 1d[Max Spell Slot Level] for a spell slot of 1d[Max Spell Slot Level]. If you do not have an available spell slot of what you lose, re-roll that die. You can gain more spell slots of the gained slot level than you can normally cast, but it is lost after a rest. ",
      "0081": "You cast fireball as a third level spell centered on yourself, as if effected by the Empowered metamagic where the DM chooses which dice for you to re-roll. ",

  };

  //Don't change below this line unless you know what you're doing.

  //Makes sure that the number generated matches how surges are stored by adding zeros.
  function zeroFill( number, width )
  {
    width -= number.toString().length;
    if ( width > 0 )
    {
      return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // always return a string
  }

  //Formats the output of a surge to a format roll20 can accept.
  function makeSurge() {
  	var roll = randomInteger(Object.keys(Surges).length);
  	var affect =  Surges[zeroFill(roll, 4)];
  	var chatMesg = "";
      chatMesg = '&{template:atk} {{rname=WildRoll}} {{rnamec=rnamec}} {{r1='+ roll + '}} {{normal=1}} {{desc=' + affect + '}}';
  	return chatMesg;
  }


  on("chat:message", function(msg) {
    //Manually call a magical surge, available to players.
  	if(msg.type == "api" && msg.content.indexOf("!MagicalSurge") !== -1) {
  		sendChat(msg.who, "/direct " + makeSurge());
  	}
    //Manually call a magical surge, only gm can see.
  	if(msg.type == "api" && msg.content.indexOf("!GMMagicalSurge") !== -1) {
  		sendChat(msg.who, "/w gm " + makeSurge());
  	}

    //Automatically detect when a spell is rolled from the coresponding characters.
    if(msg && msg.rolltemplate && (msg.rolltemplate === 'spell' || msg.rolltemplate === 'atk' || msg.rolltemplate === 'dmg' || msg.rolltemplate === 'atkdmg')){
          let character_name = msg.content.match(/charname=([^\n{}]*[^"\n{}])/);
          character_name = RegExp.$1;
          let allowed_characters = CHARACTERS.split(',');
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
  });
});
