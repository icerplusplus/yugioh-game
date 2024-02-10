import { CARD_TYPE } from '@/utils/helper/constants';
import NormalSpell from './NormalSpell';

const initializeSpellCard = {
    [CARD_TYPE.SPELL.NORMAL]: (options) => {return new NormalSpell(options)},
};

export default initializeSpellCard;