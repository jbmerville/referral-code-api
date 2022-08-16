import { ReferralType } from 'src/types/ReferralData';
import getParentReferralDocumentId from 'src/firestore/getParentReferralDocumentId';
import { getReferralByDocumentId } from '@firestore/getReferralByDocumentId';
import { setDoc } from 'firebase/firestore';
import updateParentReferralOnSignUp from '@firestore/updateParentReferralOnSignUp';

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

const MOCK_DOC_REF = 'MOCK_DOC_REF';

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('updateParentReferralOnSignUp', () => {
  it('should successfully update existing referral document in firestore', async () => {
    // Arrange
    const expected: ReferralType = {
      ...MOCK_REFERRAL,
      childrenReferralDocumentIds: [...MOCK_REFERRAL.childrenReferralDocumentIds, MOCK_CURRENT_REFERRAL_DOCUMENT_ID],
    };
    (getParentReferralDocumentId as jest.Mock).mockReturnValue(MOCK_PARENT_REFERRAL_DOCUMENT_ID);
    (getReferralByDocumentId as jest.Mock).mockReturnValue({
      ref: MOCK_DOC_REF,
      data: (): any => expected,
    });

    // Act
    await updateParentReferralOnSignUp(MOCK_PARENT_REFERRAL_CODE, MOCK_CURRENT_REFERRAL_DOCUMENT_ID);

    // Assert
    expect(getParentReferralDocumentId).toBeCalledTimes(1);
    expect(setDoc).toBeCalledWith(MOCK_DOC_REF, expected);
    expect(console.error).toBeCalledTimes(0);
  });
});
