export const FIRESTORE_REFERRAL_CODE_DB_NAME = 'referral-codes';

export enum ReferralDbKeys {
  DiscordName = 'discordName',
  ReferralCode = 'referralCode',
  CryptoAddress = 'cryptoAddress',
  TwitterAddress = 'twitterAddress',
  ParentReferral = 'parentReferral',
  ChildrenReferrals = 'childrenReferrals',
}
