import type { NextApiRequest, NextApiResponse } from 'next';
import { RequestMethod, createMocks } from 'node-mocks-http';

import doesReferralExist from 'src/firestore/doesReferralExist';
import hasAddressUsedReferral from 'src/firestore/hasAddressUsedReferral';
import putReferralCodeData from 'src/firestore/putReferralCodeData';
import putReferralHandler from 'src/pages/api/putReferral';

interface HelloRequestResonseType {
  req: NextApiRequest;
  res: NextApiResponse<{ referralCode?: string; err?: string }>;
}

jest.mock('@firestore/putReferralCodeData');
jest.mock('@firestore/doesReferralExist');
jest.mock('@firestore/hasAddressUsedReferral');

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.clearAllMocks();
});

const MOCK_REFERRAL_CODE = 'MOCK_REFERRAL_CODE';
const MOCK_SOLANA_ADDRESS = 'AAHSdsnRREfdQNzDGRxai8CLXh9EPCoRdwULPqBYd9fb';

describe('/api/putReferral API Endpoint', () => {
  function mockRequestResponse(method: RequestMethod = 'GET'): HelloRequestResonseType {
    const { req, res }: HelloRequestResonseType = createMocks({ method });
    return { req, res };
  }

  it('should return a unsuccessful response from API with missing referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');

    // Act
    await putReferralHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Missing referral code in request body' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a unsuccessful response from API with missing crypto address error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.body = { cryptoAddress: '', referralCode: 'DUMMY-REFERRAL-CODE' };

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Missing crypto address in request body' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a unsuccessful response from API with address already used referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.body = { cryptoAddress: MOCK_SOLANA_ADDRESS, referralCode: MOCK_REFERRAL_CODE };
    (doesReferralExist as jest.Mock).mockReturnValue(false);
    (hasAddressUsedReferral as jest.Mock).mockReturnValue(true);

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Crypto address is already linked to a referral code' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a unsuccessful response from API with invalid referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.body = { cryptoAddress: MOCK_SOLANA_ADDRESS, referralCode: MOCK_REFERRAL_CODE };
    (doesReferralExist as jest.Mock).mockReturnValue(false);
    (hasAddressUsedReferral as jest.Mock).mockReturnValue(false);

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Referral code does not exist' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a unsuccessful response from API with error generating referral code error', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.body = { cryptoAddress: MOCK_SOLANA_ADDRESS, referralCode: MOCK_REFERRAL_CODE };
    (doesReferralExist as jest.Mock).mockReturnValue(true);
    (putReferralCodeData as jest.Mock).mockReturnValue(undefined);

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ err: 'Error generating referral code' });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a successful response from API with valid request parameters', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST');
    req.body = { cryptoAddress: MOCK_SOLANA_ADDRESS, referralCode: MOCK_REFERRAL_CODE };
    (doesReferralExist as jest.Mock).mockReturnValue(true);
    (putReferralCodeData as jest.Mock).mockReturnValue(MOCK_REFERRAL_CODE);

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ referralCode: MOCK_REFERRAL_CODE });
    expect(console.error).toBeCalledTimes(0);
  });

  it('should return a 405 if HTTP method is not POST', async () => {
    // Arrange
    const { req, res } = mockRequestResponse();

    // Act
    await putReferralHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({
      err: 'Method not allowed',
    });
  });
});
