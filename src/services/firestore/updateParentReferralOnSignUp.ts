import { ReferralType } from '@models/ReferralModels';
import getParentReferralDocumentId from './getParentReferralDocumentId';
import { getReferralByDocumentId } from './getReferralByDocumentId';
import { logger } from 'firebase-functions/v2';
import { setDoc } from 'firebase/firestore';

export const updateParentReferralOnSignUp = async (
  parentReferralCode: string,
  currentReferralDocumentId: string
): Promise<void> => {
  try {
    const parentReferralDocumentId = await getParentReferralDocumentId(parentReferralCode);
    const parentReferral = await getReferralByDocumentId(parentReferralDocumentId);
    const parentReferralData = parentReferral.data() as ReferralType;
    const newReferralData: ReferralType = {
      ...parentReferralData,
      childrenReferralDocumentIds: [
        ...new Set([...parentReferralData.childrenReferralDocumentIds, currentReferralDocumentId]),
      ],
    };

    await setDoc(parentReferral.ref, newReferralData);
  } catch (error) {
    const errorMessage = `Error linking crypto address to the given referral code, ${error}`;
    logger.error(errorMessage);
    throw Error(errorMessage);
  }
};
export default updateParentReferralOnSignUp;
