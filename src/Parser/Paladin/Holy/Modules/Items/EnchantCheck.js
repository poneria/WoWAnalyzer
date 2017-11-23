import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';
import { formatPercentage } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import Combatants from 'Parser/Core/Modules/Combatants';

import SUGGESTION_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';

const debug = true;

class EnchantCheck extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  suggestions(when) {
    const slots = this.combatants.selected._gearItemsBySlotId;
    Object.values(slots)
      .forEach(item => {

        let enchantQuality;

        // if an enchant, do stuff
        if(item.permanentEnchant === undefined){
          enchantQuality = 0;
        }
        else{
          switch (item.permanentEnchant) {
            // NECK
            case 5891:
              debug && console.log(`NECK => Mark of the Ancient Priestess`);
              enchantQuality = 2;
              break;

            // CLOAK
            case 5435:
              debug && console.log(`CLOAK => Binding of Agility`);
              enchantQuality = 2;
              break;
            case 5436:
              debug && console.log(`CLOAK => Binding of Intellect`);
              enchantQuality = 1;
              break;

            // RING
            case 5427:
              debug && console.log(`RING => Binding of Critical Strike`);
              enchantQuality = 2;
              break;

            default:
              debug && console.log(`ITEM ${item.id} => ENCHANT ID ${item.permanentEnchant}`);
          }

          when(enchantQuality).isLessThan(1)
            .addSuggestion((suggest, actual, recommended) => {
              return suggest('You are missing an enchant!')
              .icon('inv_misc_note_01')
              .actual(`actual`)
              .recommended(`recommended`)
              .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
          });

          when(enchantQuality).isLessThan(2)
            .addSuggestion((suggest, actual, recommended) => {
              return suggest('You have an inferior enchant.')
              .icon('inv_misc_note_01')
              .actual(`actual`)
              .recommended(`recommended`)
              .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
          });
        }
      });
  }
}

export default EnchantCheck;

/*

// ENCHANT NECK
5891: Mark of the Ancient Priestess

// ENCHANT CLOAK
5435: Binding of Agility
5436: Binding of Intellect

// ENCHANT RING
5427: Binding of Critical Strike

*/