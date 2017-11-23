import React from 'react';

import Tab from 'Main/Tab';
import Mana from 'Main/Mana';

import CoreCombatLogParser from 'Parser/Core/CombatLogParser';
import LowHealthHealing from 'Parser/Core/Modules/LowHealthHealing';
import HealingDone from 'Parser/Core/Modules/HealingDone';

import LightOfDawnNormalizer from './Normalizers/LightOfDawn';
import DivinePurposeNormalizer from './Normalizers/DivinePurpose';

import PaladinAbilityTracker from './Modules/PaladinCore/PaladinAbilityTracker';
import BeaconHealOriginMatcher from './Modules/PaladinCore/BeaconHealOriginMatcher';
import BeaconTargets from './Modules/PaladinCore/BeaconTargets';
import BeaconHealing from './Modules/PaladinCore/BeaconHealing';
import CastBehavior from './Modules/PaladinCore/CastBehavior';
import Overhealing from './Modules/PaladinCore/Overhealing';
import FillerLightOfTheMartyrs from './Modules/PaladinCore/FillerLightOfTheMartyrs';
import LightOfDawn from './Modules/PaladinCore/LightOfDawn';

import Abilities from './Modules/Features/Abilities';
import MasteryEffectiveness from './Modules/Features/MasteryEffectiveness';
import AlwaysBeCasting from './Modules/Features/AlwaysBeCasting';
import TyrsDeliverance from './Modules/Features/TyrsDeliverance';
import CooldownThroughputTracker from './Modules/Features/CooldownThroughputTracker';
import StatValues from './Modules/Features/StatValues';

import RuleOfLaw from './Modules/Talents/RuleOfLaw';
import DevotionAura from './Modules/Talents/DevotionAura';
import AuraOfSacrifice from './Modules/Talents/AuraOfSacrifice';
import AuraOfMercy from './Modules/Talents/AuraOfMercy';
import HolyAvenger from './Modules/Talents/HolyAvenger';
import DivinePurpose from './Modules/Talents/DivinePurpose';
import CrusadersMight from './Modules/Talents/CrusadersMight';

import RelicTraits from './Modules/Traits/RelicTraits';
import DeliverTheLight from './Modules/Traits/DeliverTheLight';
import ExpelTheDarkness from './Modules/Traits/ExpelTheDarkness';
import SacredDawn from './Modules/Traits/SacredDawn';
import SecondSunrise from './Modules/Traits/SecondSunrise';
import ShockTreatment from './Modules/Traits/ShockTreatment';
import TyrsMunificence from './Modules/Traits/TyrsMunificence';
import JusticeThroughSacrifice from './Modules/Traits/JusticeThroughSacrifice';

import DrapeOfShame from './Modules/Items/DrapeOfShame';
import Ilterendi from './Modules/Items/Ilterendi';
import ChainOfThrayn from './Modules/Items/ChainOfThrayn';
import ObsidianStoneSpaulders from './Modules/Items/ObsidianStoneSpaulders';
import MaraadsDyingBreath from './Modules/Items/MaraadsDyingBreath';
import SoulOfTheHighlord from './Modules/Items/SoulOfTheHighlord';
import Tier19_4set from './Modules/Items/Tier19_4set';
import Tier20_4set from './Modules/Items/Tier20_4set';
import Tier21_2set from './Modules/Items/Tier21_2set';
import Tier21_4set from './Modules/Items/Tier21_4set';

import EnchantCheck from './Modules/Items/EnchantCheck';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from './Constants';

class CombatLogParser extends CoreCombatLogParser {
  static abilitiesAffectedByHealingIncreases = ABILITIES_AFFECTED_BY_HEALING_INCREASES;

  static specModules = {
    // Normalizers
    lightOfDawnNormalizer: LightOfDawnNormalizer,
    divinePurposeNormalizer: DivinePurposeNormalizer,

    // Override the ability tracker so we also get stats for IoL and beacon healing
    abilityTracker: PaladinAbilityTracker,
    lowHealthHealing: LowHealthHealing,

    // PaladinCore
    healingDone: [HealingDone, { showStatistic: true }],
    beaconHealOriginMatcher: BeaconHealOriginMatcher,
    beaconTargets: BeaconTargets,
    beaconHealing: BeaconHealing,
    castBehavior: CastBehavior,
    overhealing: Overhealing,
    fillerLightOfTheMartyrs: FillerLightOfTheMartyrs,
    lightOfDawn: LightOfDawn,

    // Features
    abilities: Abilities,
    masteryEffectiveness: MasteryEffectiveness,
    alwaysBeCasting: AlwaysBeCasting,
    tyrsDeliverance: TyrsDeliverance,
    cooldownThroughputTracker: CooldownThroughputTracker,
    statValues: StatValues,

    // Talents
    ruleOfLaw: RuleOfLaw,
    devotionAura: DevotionAura,
    auraOfSacrifice: AuraOfSacrifice,
    auraOfMercy: AuraOfMercy,
    holyAvenger: HolyAvenger,
    divinePurpose: DivinePurpose,
    crusadersMight: CrusadersMight,

    // Traits
    relicTraits: RelicTraits,
    deliverTheLight: DeliverTheLight,
    expelTheDarkness: ExpelTheDarkness,
    sacredDawn: SacredDawn,
    secondSunrise: SecondSunrise,
    shockTreatment: ShockTreatment,
    tyrsMunificence: TyrsMunificence,
    justiceThroughSacrifice: JusticeThroughSacrifice,

    // Items:
    drapeOfShame: DrapeOfShame,
    ilterendi: Ilterendi,
    chainOfThrayn: ChainOfThrayn,
    obsidianStoneSpaulders: ObsidianStoneSpaulders,
    maraadsDyingBreath: MaraadsDyingBreath,
    soulOfTheHighlord: SoulOfTheHighlord,
    tier19_4set: Tier19_4set,
    tier20_4set: Tier20_4set,
    tier21_2set: Tier21_2set,
    tier21_4set: Tier21_4set,
    enchantCheck: EnchantCheck,
  };

  generateResults() {
    const results = super.generateResults();

    // TODO: Suggestion for enchants

    results.tabs = [
      ...results.tabs,
      {
        title: 'Mana',
        url: 'mana',
        render: () => (
          <Tab title="Mana" style={{ padding: '15px 22px' }}>
            <Mana parser={this} />
          </Tab>
        ),
      },
    ];

    return results;
  }
}

export default CombatLogParser;
