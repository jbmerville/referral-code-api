import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { ReferralType } from '@models/ReferralModels';
import { firestore } from './clientApp';
import { logger } from 'firebase-functions/v2';

const getReferralByReferralCode = async (referralCode: string): Promise<ReferralType> => {
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
      parentReferralDocumentId,
      childrenReferralDocumentIds,
    } = snapshot.docs[0].data();
    return {
      discordUsername,
      referralCode,
      cryptoAddress,
      twitterUsername,
      parentReferralDocumentId,
      childrenReferralDocumentIds,
    };
  } catch (error) {
    const errorMessage = `Error from firestore while retrieving referral code data`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
};

export default getReferralByReferralCode;
