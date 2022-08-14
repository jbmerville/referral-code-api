import type { NextApiRequest, NextApiResponse } from 'next';

import doesReferralExist from 'src/firestore/doesReferralExist';
import getReferralCodeData from 'src/firestore/getReferralCodeData';

type Data = {
  referralCode?: string;
  err?: string;
};

export default async function getReferralHandler(req: NextApiRequest, res: NextApiResponse<Data>): Promise<void> {
  if (req.method === 'GET') {
    const { referralCode } = req.query;
    if (typeof referralCode !== 'string') {
      res.status(400).json({ err: 'Invalid referral code type' });
    } else {
      if (!(await doesReferralExist(referralCode))) {
        res.status(400).json({ err: 'Referral code does not exist' });
      } else {
        const referralCodeData = await getReferralCodeData(referralCode);
        if (!referralCodeData) {
          res.status(400).json({ err: 'Error getting referral code data' });
        } else {
          res.status(200).json(referralCodeData);
        }
      }
    }
  } else {
    res.status(405).json({ err: 'Method not allowed' });
  }
}
