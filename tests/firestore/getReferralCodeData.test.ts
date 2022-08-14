import { getDocs } from 'firebase/firestore';
import getReferralCodeData from 'src/firestore/getReferralCodeData';

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

describe('getReferralCodeData', () => {
  it('should return referral data if document exist in firestore', async () => {
    // Arrange
    const expected = {
      referralCode: MOCK_REFERRAL_CODE,
      referredAddresses: [MOCK_SOLANA_ADDRESS_1, MOCK_SOLANA_ADDRESS_2],
      cryptoAddress: MOCK_SOLANA_ADDRESS_1,
      twitterUsername: MOCK_TWITTER_USERNAME,
      discordUsername: MOCK_DISCORD_USERNAME,
      parentReferralCode: MOCK_REFERRAL_CODE,
      parentcryptoAddress: MOCK_SOLANA_ADDRESS_2,
    };
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          data: (): any => expected,
        },
      ],
    });

    // Act
    const restult = await getReferralCodeData(MOCK_REFERRAL_CODE);

    // Assert
    expect(restult).toStrictEqual(expected);
    expect(console.error).toBeCalledTimes(0);
  });
});
