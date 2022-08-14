import { getDocs } from 'firebase/firestore';
import hasAddressUsedReferral from 'src/firestore/hasAddressUsedReferral';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn(),
}));
jest.spyOn(global.console, 'error');

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_SOLANA_ADDRESS_1 = 'MOCK_SOLANA_ADDRESS_1';
const MOCK_SOLANA_ADDRESS_2 = 'MOCK_SOLANA_ADDRESS_2';
const MOCK_TWITTER_USERNAME = 'MOCK_TWITTER_USERNAME';
const MOCK_DISCORD_USERNAME = 'MOCK_DISCORD_USERNAME';

afterEach(() => {
  jest.clearAllMocks();
});

describe('hasAddressUsedReferral', () => {
  it('should return true if document exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          data: (): any => ({
            referralCode: MOCK_REFERRAL_CODE,
            referredAddresses: [MOCK_SOLANA_ADDRESS_1, MOCK_SOLANA_ADDRESS_2],
            cryptoAddress: MOCK_SOLANA_ADDRESS_1,
            twitterUsername: MOCK_TWITTER_USERNAME,
            discordUsername: MOCK_DISCORD_USERNAME,
          }),
        },
      ],
    });

    // Act
    const result = await hasAddressUsedReferral(MOCK_REFERRAL_CODE);

    // Assert
    expect(result).toBe(true);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return false if document does not exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [],
    });

    // Act
    const result = await hasAddressUsedReferral(MOCK_REFERRAL_CODE);

    // Assert
    expect(result).toBe(false);
    expect(console.error).toBeCalledTimes(0);
  });
});
