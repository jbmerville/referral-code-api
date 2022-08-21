import { ReferralDbKeys } from './constants';
import { ReferralType } from '@models/ReferralModels';
import { getReferralByField } from './getReferralByField';

const getReferralByReferralCode = async (referralCode: string): Promise<ReferralType> => {
  return await getReferralByField(ReferralDbKeys.ReferralCode, referralCode);
};

export default getReferralByReferralCode;
