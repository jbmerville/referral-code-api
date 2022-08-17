import getReferralByReferralCode from './getReferralByReferralCode';

const doesReferralExist = async (referralCode: string): Promise<boolean> => {
  try {
    await getReferralByReferralCode(referralCode);
    return true;
  } catch (error) {
    return false;
  }
};

export default doesReferralExist;
