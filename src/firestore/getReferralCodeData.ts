import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { ReferralDoc } from './putReferralCodeData';
import { firestore } from './clientApp';

const getReferralCodeData = async (referralCode: string): Promise<ReferralDoc | undefined> => {
  const getReferralCodeDataQuery = query(
    collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
    where(FIRESTORE_REFERRAL_CODE_DB_KEYS.referralCode, '==', referralCode)
  );
  try {
    const snapshot = await getDocs(getReferralCodeDataQuery);
    const {
      discordUsername,
      referralCode,
      cryptoAddress,
      twitterUsername,
      referredAddresses,
      parentReferralCode,
      parentcryptoAddress,
    } = snapshot.docs[0].data();
    return {
      discordUsername,
      referralCode,
      cryptoAddress,
      twitterUsername,
      referredAddresses,
      parentReferralCode,
      parentcryptoAddress,
    };
  } catch (error) {
    console.error('Error from firestore while retrieving referral code data');
  }
};

export default getReferralCodeData;
