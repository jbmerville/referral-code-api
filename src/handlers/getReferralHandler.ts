import * as express from 'express';

import doesReferralExist from '@services/firestore/doesReferralExist';
import getReferralByReferralCode from '@services/firestore/getReferralByReferralCode';

async function getReferralHandler(req: express.Request, res: express.Response): Promise<void> {
  const { referralCode } = req.query;
  if (typeof referralCode !== 'string') {
    res.status(400).json({ err: 'Invalid referral code type' });
  }
  await handleValidRequest(referralCode as string, res);
}

async function handleValidRequest(referralCode: string, res: express.Response): Promise<void> {
  if (!(await doesReferralExist(referralCode))) {
    res.status(405).json({ err: 'Referral code does not exist' });
    return;
  }

  const referralCodeData = await getReferralByReferralCode(referralCode);
  if (!referralCodeData) {
    res.status(405).json({ err: 'Error getting referral code data' });
  } else {
    res.status(200).json(referralCodeData);
  }
}

export default getReferralHandler;
