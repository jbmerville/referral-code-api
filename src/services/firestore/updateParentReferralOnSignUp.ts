import { ExternalReferralType, ReferralType } from '@models/ReferralModels';

import addReferral from './addReferral';
import getReferralByReferralCode from './getReferralByReferralCode';
import { logger } from 'firebase-functions/v2';

export const updateParentReferralOnSignUp = async (
  parentReferralCode: string,
  currentReferral: ExternalReferralType
): Promise<void> => {
  try {
    const parentReferral = await getReferralByReferralCode(parentReferralCode);
    const newParentReferralData: ReferralType = {
      ...parentReferral,
      childrenReferrals: [...new Set([...parentReferral.childrenReferrals, currentReferral])],
    };

    await addReferral(newParentReferralData);
  } catch (error) {
    const errorMessage = `Error linking crypto address to the given referral code`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
};
export default updateParentReferralOnSignUp;
