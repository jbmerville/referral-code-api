import * as express from 'express';

import { NewReferralType, ReferralType } from '@models/ReferralModels';

import addReferral from '@services/firestore/addReferral';
import doesReferralExist from '@services/firestore/doesReferralExist';
import { generate } from 'referral-codes';
import getExternalReferralFromReferral from '@helpers/getExternalReferralFromReferral';
import getReferralByReferralCode from '@services/firestore/getReferralByReferralCode';
import hasAddressUsedReferral from '@services/firestore/hasAddressUsedReferral';
import { logger } from 'firebase-functions/v2';
import updateParentReferralOnSignUp from '@services/firestore/updateParentReferralOnSignUp';

export default async function putReferralHandler(req: express.Request, res: express.Response): Promise<void> {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = req.body;
  try {
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
  } catch (error) {
    res.status(500).json({ err: error });
  }
}

async function handleValidRequest(params: NewReferralType, res: express.Response): Promise<void> {
  try {
    const newReferralCode = await putNewReferral(params);
    res.status(200).json({ referralCode: newReferralCode });
  } catch (error) {
    res.status(500).json({ err: 'Error generating referral code' });
  }
}

export async function putNewReferral(params: NewReferralType): Promise<string> {
  const { cryptoAddress, referralCode, twitterUsername, discordUsername } = params;

  try {
    const newReferralCode = await generateReferralCode();

    const parentReferral = await getReferralByReferralCode(referralCode);
    const externalParentReferral = getExternalReferralFromReferral(parentReferral);

    const referral: ReferralType = {
      cryptoAddress,
      parentReferral: externalParentReferral,
      referralCode: newReferralCode,
      childrenReferrals: [],
    };

    if (twitterUsername) {
      referral.twitterUsername = twitterUsername;
    }
    if (discordUsername) {
      referral.discordUsername = discordUsername;
    }

    await addReferral(referral);
    await updateParentReferralOnSignUp(referralCode, referral);

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
