// Data stored for a referral
export interface ReferralType extends NewReferralType {
  parentReferral: ExternalReferralType;
  childrenReferrals: ExternalReferralType[];
}

// Data required when creating a new referral
export interface NewReferralType {
  cryptoAddress: string;
  referralCode: string;
  twitterUsername?: string;
  discordUsername?: string;
}

// Data to reference other referrals
export interface ExternalReferralType {
  cryptoAddress: string;
  referralCode: string;
}
