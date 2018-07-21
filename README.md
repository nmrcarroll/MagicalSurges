# Magical Surges

This is an script for processing magical surges for characters automatically on Roll20.
It allows for customization of your surge list and the ability to select which characters it will run on automatically.

This script has only been tested on the 5eOGL character sheet and modifications for any other sheet may still be necessary.

This project started as a modification of https://github.com/RobinKuiper/Roll20APIScripts/blob/master/WildMagic.js


# Usage
Once this script is installed it will automatically generate a rollable table for you named "MagicalSurges". All you need to do is name each item what the surge should be, for example: "Cast fireball on self".

If you already have a list I recommend using https://github.com/shdwjk/Roll20API/blob/master/TableExport/TableExport.js to import your table just a little bit quicker.

# Commands
<b>!MagicalSurge</b> = Generate a public surge, able to be used and seen by players as well as the GM.  
<b>!MagicalSurge gm</b> = Send a surge only visible to the GM, players can still use but will not see the result.  
<b>!MagicalSurge add charactername</b> = Adds charactername to the list of monitored characters to automatically roll wild magic when spells are cast.  
<b>!MagicalSurge remove charactername</b> = Removes charactername from the list of monitored characters.
