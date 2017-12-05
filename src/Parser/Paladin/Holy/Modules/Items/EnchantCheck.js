import React from 'react';

import Icon from 'common/Icon';
import ITEMS from 'common/ITEMS';
import ItemIcon from 'common/ItemIcon';
import ItemLink from 'common/ItemLink';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';

import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import Combatants from 'Parser/Core/Modules/Combatants';

import SUGGESTION_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';
import StatisticsListBox, { STATISTIC_ORDER } from 'Main/StatisticsListBox';
import SmallStatisticBox from 'Main/SmallStatisticBox';
import StatisticBox from 'Main/StatisticBox';
import { formatPercentage } from 'common/format';

const debug = true;

class EnchantCheck extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  suggestions(when) {
    const bestEnchants = [
      // NECK
      5890, // Mark of the Trained Soldier
      5891, // Mark of the Ancient Priestess
      // CLOAK
      5436, // Binding of Intellect
      // RING
      5427, // Binding of Critical Strike
      // MISC

    ];

    const cheapEnchants = [
      // NECK
      // CLOAK
      5433, // Word of Intellect
      // RING
      5423, // Word of Critical Strike
      5429, // Binding of Mastery - +200
      // MISC
    ];

    const enchantSlots = [
      1, // NECK
      10, // FINGER1
      11, // FINGER2
      14, // BACK
    ];

    let thisSlot = 0;
    const slots = this.combatants.selected._gearItemsBySlotId;
    Object.values(slots)
      .forEach(item => {
          let enchantQuality = 5; // an enchant, maybe wrong-spec

          if(enchantSlots.includes(thisSlot)) {

            // no enchant at all
            if(item.permanentEnchant === undefined){ 
              debug && console.log(`SLOT ${thisSlot} = ENCHANT MISSING`);
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

            // cheap enchant
            if(cheapEnchants.includes(item.permanentEnchant)){ 
              debug && console.log(`SLOT ${thisSlot} = CHEAP ENCHANT`);
              enchantQuality = 1;

              when(enchantQuality).isLessThan(2)
              .addSuggestion((suggest, actual, recommended) => {
                return suggest('You have a cheap enchant. Maybe upgrade?')
                .icon('inv_misc_note_01')
                .actual(`actual`)
                .recommended(`recommended`)
                .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
              });
            }

            // best enchant - console only
            if(bestEnchants.includes(item.permanentEnchant)){ 
              debug && console.log(`SLOT ${thisSlot} = BEST ENCHANT`);
              enchantQuality = 3; 
            }
            
            // wrong enchant
            when(enchantQuality).isGreaterThan(4)
            .addSuggestion((suggest, actual, recommended) => {
              return suggest('You have a wrong enchant. Are you specced correctly?')
              .icon('inv_misc_note_01')
              .actual(`actual`)
              .recommended(`recommended`)
              .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
            }); 
          }

          //debug && console.log(`ITEM ${item.id} => SLOT ${thisSlot} => ENCHANT ID ${item.permanentEnchant}`);
          thisSlot++;
        }
      );
  }



  statistic() {
    const enchantSlots = ['NECK', 'BACK', 'FINGER 1', 'FINGER 2'];

    return (
      <StatisticsListBox
        title={<span><Icon icon="inv_misc_enchantedscroll" /> Enchants</span>}
        label="Enchant checker"
        tooltip={ `Suggested enchants are...` }
      >
        {enchantSlots.map(slot => (
          <div className="flex">
            <div className="flex-main">
              {slot}
            </div>
          </div>
          ))}
      </StatisticsListBox>
    );
  }
  statisticOrder = STATISTIC_ORDER.OPTIONAL(10000);
}

export default EnchantCheck;

/*
DEBUG check
// item.slotID = undefined
// slots = object Object
// item = object Object
// slotsCounter/whichSlot = returns the slot # because _gearItemsBySlotId is indexed by slot # in Combatant.js
// ----------
// item.id = ITEM ID
// item.permanentEnchant = ENCHANT ID
*/

/*
// ENCHANT RING
5423, // Word of Critical Strike - +150
5424, // Word of Haste - +150
5425, // Word of Mastery - +150
5426, // Word of Versatility - +150
5427, // Binding of Critical Strike - +200
5428, // Binding of Haste - +200
5429, // Binding of Mastery - +200
5430, // Binding of Versatility - +200
// ENCHANT CLOAK
5431, // Word of Strength - +150
5432, // Word of Agility - +150
5433, // Word of Intellect - +150
5434, // Binding of Strength - +200
5435, // Binding of Agility - +200
5436, // Binding of Intellect - +200
// ENCHANT NECK
5437, // Mark of the Claw - crit/haste proc
5438, // Mark of the Distant Army - damage proc
5439, // Mark of the Hidden Satyr - damage proc
5889, // Mark of the Heavy Hide - armor proc
5890, // Mark of the Trained Soldier - +600 mastery
5891, // Mark of the Ancient Priestess - heal proc
5895, // Mark of the Master - +200 mastery
5896, // Mark of the Versatile - +200 versa
5897, // Mark of the Quick - +200 haste
5898, // Mark of the Deadly - +200 crit
*/

/*
  HEAD: 0,
  NECK: 1,
  SHOULDER: 2,
  SHIRT: 3,
  CHEST: 4,
  WAIST: 5,
  LEGS: 6,
  FEET: 7,
  WRISTS: 8,
  HANDS: 9,
  FINGER1: 10,
  FINGER2: 11,
  TRINKET1: 12,
  TRINKET2: 13,
  BACK: 14,
  MAINHAND: 15,
  OFFHAND: 16,
  TABARD: 17,
*/

/*statisticbox
value={(  
          <span>
            <Icon 
              icon="inv_jewelry_necklace_08" 
              style={{
                height: '1.2em',
                marginBottom: '.15em',
              }}
              alt="Downtime" 
            />
            {' '}MISSING
            <br />
            <Icon 
              icon="inv_misc_cape_20" 
              style={{
                height: '1.2em',
                marginBottom: '.15em',
              }}
              alt="Downtime" 
            />
            {' '}WRONG SPEC
            <br />
            <Icon 
              icon="inv_jewelry_ring_03" 
              style={{
                height: '1.2em',
                marginBottom: '.15em',
              }}
              alt="Downtime" 
            />
            {' '}CHEAP
            <br />
            <Icon 
              icon="inv_jewelry_ring_03" 
              style={{
                height: '1.2em',
                marginBottom: '.15em',
              }}
              alt="Downtime" 
            />
            {' '}BEST
          </span>
        )}*/