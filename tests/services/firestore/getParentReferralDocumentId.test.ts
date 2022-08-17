import { ReferralType } from '../../../src/@models/ReferralModels';
import { getDocs } from 'firebase/firestore';
import getParentReferralDocumentId from '../../../src/@services/firestore/getParentReferralDocumentId';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn(),
}));
jest.spyOn(global.console, 'error');

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_CRYPTO_ADDRESS = 'MOCK_CRYPTO_ADDRESS';
const MOCK_PARENT_REFERRAL_DOCUMENT_ID_1 = 'MOCK_PARENT_REFERRAL_DOCUMENT_ID_1';
const MOCK_CHILD_REFERRAL_DOCUMENT_ID_1 = 'MOCK_CHILD_REFERRAL_DOCUMENT_ID_1';
const MOCK_CHILD_REFERRAL_DOCUMENT_ID_2 = 'MOCK_CHILD_REFERRAL_DOCUMENT_ID_2';
const MOCK_TWITTER_USERNAME = 'MOCK_TWITTER_USERNAME';
const MOCK_DISCORD_USERNAME = 'MOCK_DISCORD_USERNAME';

afterEach(() => {
  jest.clearAllMocks();
});

describe('getParentReferralDocumentId', () => {
  it('should return parent address if document exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          id: MOCK_PARENT_REFERRAL_DOCUMENT_ID_1,
          data: (): ReferralType => ({
            referralCode: MOCK_REFERRAL_CODE,
            cryptoAddress: MOCK_CRYPTO_ADDRESS,
            childrenReferralDocumentIds: [MOCK_CHILD_REFERRAL_DOCUMENT_ID_1, MOCK_CHILD_REFERRAL_DOCUMENT_ID_2],
            parentReferralDocumentId: MOCK_PARENT_REFERRAL_DOCUMENT_ID_1,
            twitterUsername: MOCK_TWITTER_USERNAME,
            discordUsername: MOCK_DISCORD_USERNAME,
          }),
        },
      ],
    });

    // Act
    const result = await getParentReferralDocumentId(MOCK_REFERRAL_CODE);

    // Assert
    expect(result).toBe(MOCK_PARENT_REFERRAL_DOCUMENT_ID_1);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should throw an exeption if document does not exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [],
    });

    // Assert
    await expect(getParentReferralDocumentId(MOCK_REFERRAL_CODE)).rejects.toThrowError(
      `No referral code found for code: ${MOCK_REFERRAL_CODE}`
    );
    expect(console.error).toBeCalledTimes(1);
  });
});
