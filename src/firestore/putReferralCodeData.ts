import { FIRESTORE_REFERRAL_CODE_DB_KEYS, FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import { addDoc, collection, getDocs, query, setDoc, where } from 'firebase/firestore';

import { PutReferralParameters } from 'src/pages/api/putReferral';
import doesReferralExist from './doesReferralExist';
import { firestore } from './clientApp';
import { generate } from 'referral-codes';
import getParentAddress from './getParentAddress';

export interface ReferralDoc extends PutReferralParameters {
  referredAddresses: string[];
  parentReferralCode: string;
  parentcryptoAddress?: string;
}

const putReferralCodeData = async (params: PutReferralParameters): Promise<string | undefined> => {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = params;

  try {
    let newReferralCode = generate({
      prefix: '5CLUB-',
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    })[0];

    while (await doesReferralExist(newReferralCode)) {
      newReferralCode = generate({
        prefix: '5CLUB-',
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      })[0];
    }

    const parentcryptoAddress = await getParentAddress(referralCode);

    const newDoc: ReferralDoc = {
      cryptoAddress,
      parentReferralCode: referralCode,
      referralCode: newReferralCode,
      referredAddresses: [],
    };

    if (parentcryptoAddress) {
      newDoc.parentcryptoAddress = parentcryptoAddress;
    }
    if (twitterUsername) {
      newDoc.twitterUsername = twitterUsername;
    }
    if (discordUsername) {
      newDoc.discordUsername = discordUsername;
    }

    await addDoc(collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME), newDoc);

    await updatePreviousReferralCode(referralCode, cryptoAddress);
    return newReferralCode;
  } catch (error) {
    console.error('Error generating new referral code', error);
  }
};

export const updatePreviousReferralCode = async (
  referralCode: string,
  newcryptoAddressReferred: string
): Promise<void> => {
  try {
    const previousReferralQuery = query(
      collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME),
      where(FIRESTORE_REFERRAL_CODE_DB_KEYS.referralCode, '==', referralCode)
    );

    const snapshot = await getDocs(previousReferralQuery);
    const previousReferralData = snapshot.docs[0].data();
    const newReferralData = {
      ...previousReferralData,
      referredAddresses: [...new Set([...previousReferralData.referredAddresses, newcryptoAddressReferred])],
    };

    await setDoc(snapshot.docs[0].ref, newReferralData);
  } catch (error) {
    console.error('Error linking Solana address to the given referral code');
  }
};
export default putReferralCodeData;
