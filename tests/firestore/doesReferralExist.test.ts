import doesReferralExist from 'src/firestore/doesReferralExist';
import { getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn(),
  setDoc: jest.fn().mockReturnValue(''),
  addDoc: jest.fn(),
}));
jest.spyOn(global.console, 'error');

const MOCK_DOC_REF = 'MOCK_DOC_REF';
const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';

afterEach(() => {
  jest.clearAllMocks();
});

describe('doesReferralExist', () => {
  it('should return true if document exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [
        {
          ref: MOCK_DOC_REF,
          data: (): any => ({ referralCode: MOCK_REFERRAL_CODE }),
        },
      ],
    });

    // Act
    const restult = await doesReferralExist(MOCK_REFERRAL_CODE);

    // Assert
    expect(restult).toBe(true);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return false if document does not exist in firestore', async () => {
    // Arrange
    (getDocs as jest.Mock).mockReturnValue({
      docs: [],
    });

    // Act
    const restult = await doesReferralExist(MOCK_REFERRAL_CODE);

    // Assert
    expect(restult).toBe(false);
    expect(console.error).toBeCalledTimes(0);
  });
});
