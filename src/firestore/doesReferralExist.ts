import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { firestore } from './clientApp';

const doesReferralExist = async (referralCode: string): Promise<boolean> => {
  const isReferralUsedQuery = query(
    collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
    where(FIRESTORE_REFERRAL_CODE_DB_KEYS.referralCode, '==', referralCode)
  );
  let res = 0;
  try {
    const snapshot = await getDocs(isReferralUsedQuery);
    snapshot.docs.forEach(() => {
      res++;
    });
  } catch (error) {
    const errorMessage = `Error from firestore while checking if the given referral code exist or not`;
    console.error(errorMessage, error);
    throw Error(errorMessage);
  }
  return res > 0;
};

export default doesReferralExist;
