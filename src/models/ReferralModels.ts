export interface ReferralType extends NewReferralType {
  parentReferralDocumentId: string;
  childrenReferralDocumentIds: string[];
}

export interface NewReferralType {
  cryptoAddress: string;
  referralCode: string;
  twitterUsername?: string;
  discordUsername?: string;
}
