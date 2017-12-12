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

const bestEnchants = [
    // NECK
    5890, // Mark of the Trained Soldier
    5891, // Mark of the Ancient Priestess
    // CLOAK
    5436, // Binding of Intellect
    // RING
    5427, // Binding of Critical Strike
  ];

  const cheapEnchants = [
    // NECK
    // CLOAK
    5433, // Word of Intellect
    // RING
    5423, // Word of Critical Strike
    5429, // Binding of Mastery - +200
  ];

  const enchantSlots = [
    1, // NECK
    10, // FINGER1
    11, // FINGER2
    14, // BACK
  ];

class EnchantCheck extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  enchantStatus = [
    // 0 neck
    // 1 back
    // 2 finger 1
    // 3 finger 2
  ];
  suggestionTrigger = 0;

  suggestions(when) {
    slots = this.combatants.selected._gearItemsBySlotId;
    slot = 0;
    Object.values(slots)
      .forEach(item => {
        if (enchantSlots.includes(slot)) {
          calcEnchant(slot, item.permanentEnchant);
        }
        slot++;
      });

    enchantStatus.forEach(slot => {
      if(!slot.includes('Best!')) {
        suggestionTrigger = 1;
      }
    });

    when(suggestionTrigger).isGreaterThan(0)
    .addSuggestion((suggest, actual, recommended) => {
      return suggest('You have missing, wrong, or cheap enchants. Check your gear and class guide for the best enchants.')
      .icon('inv_misc_note_01')
      .actual(`actual`)
      .recommended(`recommended`)
      .staticImportance(SUGGESTION_IMPORTANCE.MINOR);
    }); 
  }

  // calculate whether the enchant is missing, best, cheap, or wrong
  calcEnchant(slot, enchantId) {
    var index = -1;
    switch(slot) {
      case 1: 
        index = 0;
        break;
      case 14:
        index = 1;
        break;
      case 10:
        index = 2;
        break;
      case 11:
        index = 3;
    }

    // missing enchant
    if (enchantId === undefined){
      enchantStatus[index] = 'MISSING';
    }
    if (cheapEnchants.includes(enchantId)) {
      enchantStatus[index] = 'Cheap';
    } else if (bestEnchants.includes(enchantId)) {
      enchantStatus[index] = 'Best!';
    } else {
      enchantStatus[index] = 'Wrong spec?';
    }
  }

  formatEnchant() {
    // format the enchants for the statistic box
  }

  statistic() {
    return (
      <StatisticsListBox
        title={<span><Icon icon="inv_misc_enchantedscroll" /> Enchants</span>}
        //tooltip={ `Suggested enchants are...` }
      >
        {enchantStatus.map(slot => (
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