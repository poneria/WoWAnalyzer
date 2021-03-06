import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';

class Tier21_4p extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  totalDeathCoilCasts = 0;
  totalDeathCoilDamageEvents = 0;

  on_initialized() {
    this.active = this.combatants.selected.hasBuff(SPELLS.UNHOLY_DEATH_KNIGHT_T21_4SET_BONUS.id);
  }

  on_byPlayer_cast(event){
    const spellId = event.ability.guid;
    if(spellId !== SPELLS.DEATH_COIL.id){
      return;
    }
    this.totalDeathCoilCasts++;    
  }

  on_byPlayer_damage(event){
    const spellId = event.ability.guid;
    if(spellId !== SPELLS.DEATH_COIL_DAMAGE.id){
      return;
    }
    this.totalDeathCoilDamageEvents++; 
  }

  item() {
    // master of ghouls is buff granted by the set bonus
    const freeDeathcoils = (this.totalDeathCoilDamageEvents - this.totalDeathCoilCasts) / this.totalDeathCoilCasts;
    return {
      id: `spell-${SPELLS.UNHOLY_DEATH_KNIGHT_T21_4SET_BONUS.id}`,
      icon: <SpellIcon id={SPELLS.UNHOLY_DEATH_KNIGHT_T21_4SET_BONUS.id} />,
      title: <SpellLink id={SPELLS.UNHOLY_DEATH_KNIGHT_T21_4SET_BONUS.id} />,
      result: <span>{formatPercentage(freeDeathcoils)} % of Death Coil casts dealt damage a second time</span>,
    };
  }
}

export default Tier21_4p;