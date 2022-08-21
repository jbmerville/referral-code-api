import { FIRESTORE_REFERRAL_CODE_DB_NAME, ReferralDbKeys } from './constants';

import { ReferralType } from '@models/ReferralModels';
import { db } from './clientApp';
import { logger } from 'firebase-functions/v2';

export const getReferralByField = async (field: ReferralDbKeys, value: string): Promise<ReferralType> => {
  try {
    const query = db.collection(FIRESTORE_REFERRAL_CODE_DB_NAME).where(field, '==', value);
    logger.info(`Running Firebase query: ${field} == ${value}, on collection: ${FIRESTORE_REFERRAL_CODE_DB_NAME}`);
    const snapshot = await query.get();

    if (snapshot.docs.length === 0) {
      const errorMessage = `No document found for query: ${field} == ${value}`;
      logger.error(errorMessage);
      throw Error(errorMessage);
    }
    if (snapshot.docs.length > 1) {
      const errorMessage = `More than 1 document found for query: ${field} == ${value}, found ${snapshot.docs.length}`;
      logger.warn(errorMessage);
    }

    logger.info(`Firebase returned: ${JSON.stringify(snapshot.docs[0].data())}`);
    return snapshot.docs[0].data() as ReferralType;
  } catch (error) {
    const errorMessage = `Error querrying Firestore with query: ${field} == ${value}`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
};
