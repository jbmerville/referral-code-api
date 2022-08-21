import { ReferralDbKeys } from './constants';
import { getReferralByField } from './getReferralByField';

const hasAddressUsedReferral = async (address: string): Promise<boolean> => {
  try {
    await getReferralByField(ReferralDbKeys.CryptoAddress, address);
  } catch (error) {
    return false;
  }
  return false;
};

export default hasAddressUsedReferral;
