import { ReferralType } from '../../../src/@models/ReferralModels';
import { addDoc } from 'firebase/firestore';
import doesReferralExist from '../../../src/@services/firestore/doesReferralExist';
import getParentReferralDocumentId from '../../../src/@services/firestore/getParentReferralDocumentId';
import { putNewReferral } from '../../../src/@handlers/putReferralHandler';
import updateParentReferralOnSignUp from '../../../src/@services/firestore/updateParentReferralOnSignUp';

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_PARENT_REFERRAL_CODE = 'MOCK_PARENT_REFERRAL_CODE';
const MOCK_CRYPTO_ADDRESS = 'MOCK_CRYPTO_ADDRESS';
const MOCK_PARENT_REFERRAL_DOCUMENT_ID = 'MOCK_PARENT_REFERRAL_DOCUMENT_ID';
const MOCK_CURRENT_REFERRAL_DOCUMENT_ID = 'MOCK_CURRENT_REFERRAL_DOCUMENT_ID';
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

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn(),
  setDoc: jest.fn().mockReturnValue(''),
  addDoc: jest.fn(),
}));

jest.mock('referral-codes', () => ({
  ...jest.requireActual('referral-codes'),
  generate: jest.fn().mockReturnValue(['MOCK_REFERRAL_CODE']),
}));
jest.spyOn(global.console, 'error');
jest.mock('@firestore/doesReferralExist');
jest.mock('@firestore/getParentReferralDocumentId');
jest.mock('@firestore/getReferralByDocumentId');
jest.mock('@firestore/updateParentReferralOnSignUp');

afterEach(() => {
  jest.clearAllMocks();
});

describe('putReferralCodeData', () => {
  it('should successfully add new referral document in firestore and return a referral code', async () => {
    // Arrange
    const input = {
      cryptoAddress: MOCK_CRYPTO_ADDRESS,
      referralCode: MOCK_PARENT_REFERRAL_CODE,
      twitterUsername: MOCK_TWITTER_USERNAME,
      discordUsername: MOCK_DISCORD_USERNAME,
    };
    const expected: ReferralType = {
      ...MOCK_REFERRAL,
      childrenReferralDocumentIds: [],
    };
    (doesReferralExist as jest.Mock).mockReturnValue(false);
    (addDoc as jest.Mock).mockReturnValue({
      id: MOCK_CURRENT_REFERRAL_DOCUMENT_ID,
    });
    (updateParentReferralOnSignUp as jest.Mock).mockReturnValue(null);
    (getParentReferralDocumentId as jest.Mock).mockReturnValue(MOCK_PARENT_REFERRAL_DOCUMENT_ID);
    // Act
    const result = await putNewReferral(input);

    // Assert
    expect(result).toBe(MOCK_REFERRAL_CODE);
    expect(addDoc).toBeCalledWith(expect.any(Object), expected);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should throw an exception if getParentReferralDocumentId throws an execption', async () => {
    // Arrange
    const input = { cryptoAddress: MOCK_CRYPTO_ADDRESS, referralCode: '' };

    (doesReferralExist as jest.Mock).mockReturnValue(false);
    (getParentReferralDocumentId as jest.Mock).mockRejectedValue('');

    // Assert
    await expect(putNewReferral(input)).rejects.toThrowError(`Error generating new referral code`);
    expect(console.error).toBeCalledTimes(1);
  });
});
