import { ReferralType } from '../../../src/@models/ReferralModels';
import { getDocs } from 'firebase/firestore';
import getReferralByReferralCode from '../../../src/@services/firestore/getReferralByReferralCode';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn(),
}));
jest.spyOn(global.console, 'error');

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_CRYPTO_ADDRESS = 'MOCK_CRYPTO_ADDRESS';
const MOCK_PARENT_REFERRAL_DOCUMENT_ID = 'MOCK_PARENT_REFERRAL_DOCUMENT_ID';
const MOCK_CHILD_REFERRAL_DOCUMENT_ID_1 = 'MOCK_CHILD_REFERRAL_DOCUMENT_ID_1';
const MOCK_CHILD_REFERRAL_DOCUMENT_ID_2 = 'MOCK_CHILD_REFERRAL_DOCUMENT_ID_2';
const MOCK_TWITTER_USERNAME = 'MOCK_TWITTER_USERNAME';
const MOCK_DISCORD_USERNAME = 'MOCK_DISCORD_USERNAME';
const MOCK_REFERRAL: ReferralType = {
  referralCode: MOCK_REFERRAL_CODE,
  cryptoAddress: MOCK_CRYPTO_ADDRESS,
  childrenReferralDocumentIds: [MOCK_CHILD_REFERRAL_DOCUMENT_ID_1, MOCK_CHILD_REFERRAL_DOCUMENT_ID_2],
  parentReferralDocumentId: MOCK_PARENT_REFERRAL_DOCUMENT_ID,
  twitterUsername: MOCK_TWITTER_USERNAME,
  discordUsername: MOCK_DISCORD_USERNAME,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('getReferralByReferralCode', () => {
  it('should return referral data if document exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [{ data: (): ReferralType => MOCK_REFERRAL }],
    });

    // Act
    const result = await getReferralByReferralCode(MOCK_REFERRAL_CODE);

    // Assert
    expect(result).toEqual(MOCK_REFERRAL);
    expect(console.error).toBeCalledTimes(0);
  });
});
