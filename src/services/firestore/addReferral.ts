import { FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { ReferralType } from '@models/ReferralModels';
import { db } from './clientApp';
import { logger } from 'firebase-functions/v2';

const addReferral = async (referral: ReferralType): Promise<void> => {
  try {
    db.collection(FIRESTORE_REFERRAL_CODE_DB_NAME).doc(referral.referralCode).set(referral);
  } catch (error) {
    const errorMessage = `Error adding referral with data: ${referral}`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
};

export default addReferral;
