import type { NextApiRequest, NextApiResponse } from 'next';
import { RequestMethod, createMocks } from 'node-mocks-http';

import doesReferralExist from 'src/firestore/doesReferralExist';
import getReferralByReferralCode from '@firestore/getReferralByReferralCode';
import getRerralHandler from 'src/pages/api/getReferral/[referralCode]';

interface HelloRequestResonseType {
  req: NextApiRequest;
  res: NextApiResponse<{ referralCode?: string; err?: string }>;
}

jest.mock('@firestore/getReferralByReferralCode');
jest.mock('@firestore/doesReferralExist');
jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.clearAllMocks();
});

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_SOLANA_ADDRESS_1 = 'MOCK_SOLANA_ADDRESS_1';
const MOCK_SOLANA_ADDRESS_2 = 'MOCK_SOLANA_ADDRESS_2';
const MOCK_PARENT_REFERRAL_CODE = 'MOCK_PARENT_REFERRAL_CODE';

describe('/api/getReferral API Endpoint', () => {
  function mockRequestResponse(method: RequestMethod = 'GET'): HelloRequestResonseType {
    const { req, res }: HelloRequestResonseType = createMocks({ method });
    return { req, res };
  }

  it('should return a unsuccessful response from API with invalid referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse();
    req.query = { referralCode: MOCK_REFERRAL_CODE };

    (doesReferralExist as jest.Mock).mockReturnValue(false);

    // Act
    await getRerralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Referral code does not exist' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a unsuccessful response from API with error generating referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse();
    const expected = {
      referredAddresses: [MOCK_SOLANA_ADDRESS_1, MOCK_SOLANA_ADDRESS_2],
      referralCode: MOCK_REFERRAL_CODE,
      parentReferralCodeData: MOCK_PARENT_REFERRAL_CODE,
    };
    req.query = { referralCode: MOCK_REFERRAL_CODE };
    (getReferralByReferralCode as jest.Mock).mockReturnValue(expected);
    (doesReferralExist as jest.Mock).mockReturnValue(true);

    // Act
    await getRerralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(expected);
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a 405 if HTTP method is not GET', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.query = { referralCode: MOCK_REFERRAL_CODE };

    // Act
    await getRerralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({
      err: 'Method not allowed',
    });
  });
});
