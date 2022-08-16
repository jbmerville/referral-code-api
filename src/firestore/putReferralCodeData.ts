import { NewReferralType, ReferralType } from 'src/types/ReferralData';
import { addDoc, collection, setDoc } from 'firebase/firestore';

import { FIRESTORE_REFERRAL_CODE_DB_NAME } from './constants';
import doesReferralExist from './doesReferralExist';
import { firestore } from './clientApp';
import { generate } from 'referral-codes';
import getParentReferralDocumentId from './getParentReferralDocumentId';
import updateParentReferralOnSignUp from './updateParentReferralOnSignUp';

const putReferralCodeData = async (params: NewReferralType): Promise<string> => {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = params;

  try {
    let newReferralCode = generate({
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    })[0];

    while (await doesReferralExist(newReferralCode)) {
      newReferralCode = generate({
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      })[0];
    }

    const parentReferralDocumentId = await getParentReferralDocumentId(referralCode);

    const newDoc: ReferralType = {
      cryptoAddress,
      parentReferralDocumentId,
      referralCode: newReferralCode,
      childrenReferralDocumentIds: [],
    };

    if (twitterUsername) {
      newDoc.twitterUsername = twitterUsername;
    }
    if (discordUsername) {
      newDoc.discordUsername = discordUsername;
    }

    const doc = await addDoc(collection(firestore, FIRESTORE_REFERRAL_CODE_DB_NAME), newDoc);

    await updateParentReferralOnSignUp(referralCode, doc.id);
    return newReferralCode;
  } catch (error) {
    const errorMessage = `Error generating new referral code`;
    console.error(errorMessage, error);
    throw Error(errorMessage);
  }
};

export default putReferralCodeData;
