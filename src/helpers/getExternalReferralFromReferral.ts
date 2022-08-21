import { ExternalReferralType, ReferralType } from '@models/ReferralModels';

function getExternalReferralFromReferral(referral: ReferralType): ExternalReferralType {
  return { referralCode: referral.referralCode, cryptoAddress: referral.cryptoAddress };
}

export default getExternalReferralFromReferral;
