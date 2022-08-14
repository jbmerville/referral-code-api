import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './clientApp';

const getParentAddress = async (referralCode: string): Promise<string | undefined> => {
  const isReferralUsedQuery = query(
    collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
    where(FIRESTORE_REFERRAL_CODE_DB_KEYS.referralCode, '==', referralCode)
  );
  try {
    const snapshot = await getDocs(isReferralUsedQuery);
    const { cryptoAddress } = snapshot.docs[0].data();
    return cryptoAddress;
  } catch (error) {
    console.error('Error from firestore while checking if the given referral code exist or not');
  }
};

export default getParentAddress;
