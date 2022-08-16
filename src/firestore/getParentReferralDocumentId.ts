import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './clientApp';

const getParentReferralDocumentId = async (referralCode: string): Promise<string> => {
  const isReferralUsedQuery = query(
    collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
    where(FIRESTORE_REFERRAL_CODE_DB_KEYS.referralCode, '==', referralCode)
  );
  try {
    const snapshot = await getDocs(isReferralUsedQuery);
    return snapshot.docs[0].id;
  } catch (error) {
    const errorMessage = `No referral code found for code: ${referralCode}`;
    console.error(errorMessage, error);
    throw Error(errorMessage);
  }
};

export default getParentReferralDocumentId;
