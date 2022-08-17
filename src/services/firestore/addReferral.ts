import { addDoc, collection } from 'firebase/firestore';

import { FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { ReferralType } from '@models/ReferralModels';
import { firestore } from './clientApp';
import { logger } from 'firebase-functions/v2';

const addReferral = async (referral: ReferralType): Promise<string> => {
  try {
    const doc = await addDoc(collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME), referral);
    return doc.id;
  } catch (error) {
    const errorMessage = `Error adding referral  with data: ${referral}`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
};

export default addReferral;
