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

          when(enchantQuality).isLessThan(1)
            .addSuggestion((suggest, actual, recommended) => {
              return suggest('You are missing an enchant!')
              .icon('inv_misc_note_01')
              .actual(`actual`)
              .recommended(`recommended`)
              .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
          });
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
              enchantQuality = 1;
              break;
            case 5436:
              debug && console.log(`CLOAK => Binding of Intellect`);
              enchantQuality = 0;
              break;

            // RING
            case 5427:
              debug && console.log(`RING => Binding of Critical Strike`);
              enchantQuality = 2;
              break;

            default:
              debug && console.log(`ITEM ${item.id} => ENCHANT ID ${item.permanentEnchant}`);
          }

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

// ENCHANT RING
5423: Word of Critical Strike - +150
5424: Word of Haste - +150
5425: Word of Mastery - +150
5426: Word of Versatility - +150

5427: Binding of Critical Strike - +200
5428: Binding of Haste - +200
5429: Binding of Mastery - +200
5430: Binding of Versatility - +200

// ENCHANT CLOAK
5431: Word of Strength - +150
5432: Word of Agility - +150
5433: Word of Intellect - +150

5434: Binding of Strength - +200
5435: Binding of Agility - +200
5436: Binding of Intellect - +200

// ENCHANT NECK
5437: Mark of the Claw - crit/haste proc
5438: Mark of the Distant Army - damage proc
5439: Mark of the Hidden Satyr - damage proc

5889: Mark of the Heavy Hide - armor proc
5890: Mark of the Trained Soldier - +600 mastery
5891: Mark of the Ancient Priestess - heal proc

5895: Mark of the Master - +200 mastery
5896: Mark of the Versatile - +200 versa
5897: Mark of the Quick - +200 haste
5898: Mark of the Deadly - +200 crit

*/