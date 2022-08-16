import type { NextApiRequest, NextApiResponse } from 'next';

import { NewReferralType } from 'src/types/ReferralData';
import { PublicKey } from '@solana/web3.js';
import doesReferralExist from 'src/firestore/doesReferralExist';
import hasAddressUsedReferral from 'src/firestore/hasAddressUsedReferral';
import putReferralCodeData from 'src/firestore/putReferralCodeData';

type Data = {
  referralCode?: string;
  err?: string;
};

export default async function putReferralHandler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  if (req.method === 'POST') {
    const { cryptoAddress, referralCode, twitterUsername, discordUsername } = req.body;

    if (!referralCode) {
      res.status(400).json({ err: 'Missing referral code in request body' });
    } else if (!cryptoAddress) {
      res.status(400).json({ err: 'Missing crypto address in request body' });
    } else if (await hasAddressUsedReferral(cryptoAddress)) {
      res.status(400).json({ err: 'Crypto address is already linked to a referral code' });
    } else if (!(await doesReferralExist(referralCode))) {
      res.status(400).json({ err: 'Referral code does not exist' });
    } else {
      handleValidRequest({ cryptoAddress, referralCode, twitterUsername, discordUsername }, res);
    }
  } else {
    res.status(405).json({ err: 'Method not allowed' });
  }
}

async function handleValidRequest(params: NewReferralType, res: NextApiResponse<Data>): Promise<void> {
  const newReferralCode = await putReferralCodeData(params);
  if (!newReferralCode) {
    res.status(400).json({ err: 'Error generating referral code' });
  } else {
    res.status(200).json({ referralCode: newReferralCode });
  }
}

function validateSolAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    const isSolana = PublicKey.isOnCurve(pubkey.toBuffer());
    return isSolana;
  } catch (error) {
    return false;
  }
}
