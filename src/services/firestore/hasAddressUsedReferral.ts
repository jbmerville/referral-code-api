import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './clientApp';
import { logger } from 'firebase-functions/v2';

const hasAddressUsedReferral = async (address: string): Promise<boolean> => {
  const isReferralUsedQuery = query(
    collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
    where(FIRESTORE_REFERRAL_CODE_DB_KEYS.cryptoAddress, '==', address)
  );
  let res = 0;
  try {
    const snapshot = await getDocs(isReferralUsedQuery);
    res = snapshot.docs.length;
  } catch (error) {
    logger.error('Error from firestore while checking if the address has used a referral code or not');
  }
  return res > 0;
};

export default hasAddressUsedReferral;
