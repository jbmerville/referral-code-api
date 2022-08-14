import { addDoc, getDocs, setDoc } from 'firebase/firestore';
import putReferralCodeData, { updatePreviousReferralCode } from 'src/firestore/putReferralCodeData';

import doesReferralExist from 'src/firestore/doesReferralExist';
import getParentAddress from 'src/firestore/getParentAddress';

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_SOLANA_ADDRESS_1 = 'MOCK_SOLANA_ADDRESS_1';
const MOCK_SOLANA_ADDRESS_2 = 'MOCK_SOLANA_ADDRESS_2';
const MOCK_PARENT_REFERRAL_CODE = 'MOCK_PARENT_REFERRAL_CODE';
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
jest.mock('@firestore/getParentAddress');

afterEach(() => {
  jest.clearAllMocks();
});

describe('updatePreviousReferralCode', () => {
  it('should successfully update existing referral document in firestore', async () => {
    // Arrange
    const expected = {
      referredAddresses: [MOCK_SOLANA_ADDRESS_1, MOCK_SOLANA_ADDRESS_2],
      referralCode: MOCK_REFERRAL_CODE,
      parentReferralCode: MOCK_PARENT_REFERRAL_CODE,
    };
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          ref: MOCK_DOC_REF,
          data: (): any => expected,
        },
      ],
    });

    // Act
    const result = await updatePreviousReferralCode(MOCK_PARENT_REFERRAL_CODE, MOCK_SOLANA_ADDRESS_2);

    // Assert
    expect(setDoc).toBeCalledTimes(1);
    expect(setDoc).toBeCalledWith(MOCK_DOC_REF, expected);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should successfully update existing referral document in firestore with duplicate address', async () => {
    // Arrange
    const expected = {
      referredAddresses: [MOCK_SOLANA_ADDRESS_1],
      referralCode: MOCK_REFERRAL_CODE,
    };
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          ref: MOCK_DOC_REF,
          data: (): any => expected,
        },
      ],
    });

    // Act
    await updatePreviousReferralCode(MOCK_REFERRAL_CODE, MOCK_SOLANA_ADDRESS_1);

    // Assert
    expect(setDoc).toBeCalledTimes(1);
    expect(setDoc).toBeCalledWith(MOCK_DOC_REF, expected);
    expect(console.error).toBeCalledTimes(0);
  });
});

describe('putReferralCodeData', () => {
  it('should successfully add new referral document in firestore and return a referral code', async () => {
    // Arrange
    const input = { cryptoAddress: MOCK_SOLANA_ADDRESS_1, referralCode: MOCK_PARENT_REFERRAL_CODE };
    const expected = {
      referredAddresses: [],
      referralCode: MOCK_REFERRAL_CODE,
      parentReferralCode: MOCK_PARENT_REFERRAL_CODE,
      cryptoAddress: MOCK_SOLANA_ADDRESS_1,
    };
    (doesReferralExist as jest.Mock).mockReturnValue(false);

    // Act
    const result = await putReferralCodeData(input);

    // Assert
    expect(result).toBe(MOCK_REFERRAL_CODE);
    expect(addDoc).toBeCalledWith(expect.any(Object), expected);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should successfully add new referral document in firestore and return a referral code with parent Solana address', async () => {
    // Arrange
    const input = { cryptoAddress: MOCK_SOLANA_ADDRESS_1, referralCode: MOCK_PARENT_REFERRAL_CODE };
    const expected = {
      referredAddresses: [],
      referralCode: MOCK_REFERRAL_CODE,
      parentReferralCode: MOCK_PARENT_REFERRAL_CODE,
      cryptoAddress: MOCK_SOLANA_ADDRESS_1,
      parentcryptoAddress: MOCK_SOLANA_ADDRESS_2,
    };
    (doesReferralExist as jest.Mock).mockReturnValue(false);
    (getParentAddress as jest.Mock).mockReturnValue(MOCK_SOLANA_ADDRESS_2);

    // Act
    const result = await putReferralCodeData(input);

    // Assert
    expect(result).toBe(MOCK_REFERRAL_CODE);
    expect(addDoc).toBeCalledWith(expect.any(Object), expected);
    expect(console.error).toBeCalledTimes(0);
  });
});
