import * as express from 'express';

import { NewReferralType, ReferralType } from '@models/ReferralModels';

import addReferral from '@services/firestore/addReferral';
import doesReferralExist from '@services/firestore/doesReferralExist';
import { generate } from 'referral-codes';
import getParentReferralDocumentId from '@services/firestore/getParentReferralDocumentId';
import hasAddressUsedReferral from '@services/firestore/hasAddressUsedReferral';
import { logger } from 'firebase-functions/v2';
import updateParentReferralOnSignUp from '@services/firestore/updateParentReferralOnSignUp';

export default async function putReferralHandler(req: express.Request, res: express.Response): Promise<void> {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = req.body;

  if (!referralCode) {
    res.status(400).json({ err: 'Missing referral code in request body' });
  } else if (!cryptoAddress) {
    res.status(400).json({ err: 'Missing crypto address in request body' });
  } else if (await hasAddressUsedReferral(cryptoAddress)) {
    res.status(405).json({ err: 'Crypto address is already linked to a referral code' });
  } else if (!(await doesReferralExist(referralCode))) {
    res.status(405).json({ err: 'Input referral code does not exist' });
  } else {
    handleValidRequest({ cryptoAddress, referralCode, twitterUsername, discordUsername }, res);
  }
}

async function handleValidRequest(params: NewReferralType, res: express.Response): Promise<void> {
  const newReferralCode = await putNewReferral(params);
  if (!newReferralCode) {
    res.status(400).json({ err: 'Error generating referral code' });
  } else {
    res.status(200).json({ referralCode: newReferralCode });
  }
}

export async function putNewReferral(params: NewReferralType): Promise<string> {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = params;

  try {
    const newReferralCode = await generateReferralCode();

    const parentReferralDocumentId = await getParentReferralDocumentId(referralCode);

    const referral: ReferralType = {
      cryptoAddress,
      parentReferralDocumentId,
      referralCode: newReferralCode,
      childrenReferralDocumentIds: [],
    };

    if (twitterUsername) {
      referral.twitterUsername = twitterUsername;
    }
    if (discordUsername) {
      referral.discordUsername = discordUsername;
    }

    const referralDocId = await addReferral(referral);

    await updateParentReferralOnSignUp(referralCode, referralDocId);
    return newReferralCode;
  } catch (error) {
    const errorMessage = `Error generating new referral code`;
    logger.error(errorMessage, error);
    throw Error(errorMessage);
  }
}

async function generateReferralCode(): Promise<string> {
  let referralCode = generate({
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  })[0];

  while (await doesReferralExist(referralCode)) {
    referralCode = generate({
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    })[0];
  }

  return referralCode;
}
