import type { NextApiRequest, NextApiResponse } from 'next';
import { RequestMethod, createMocks } from 'node-mocks-http';

import helloHandler from 'src/pages/api/hello';

interface HelloRequestResonseType {
  req: NextApiRequest;
  res: NextApiResponse<{ hello?: string; err?: string }>;
}

describe('/api/hello API Endpoint', () => {
  function mockRequestResponse(method: RequestMethod = 'GET'): HelloRequestResonseType {
    const { req, res }: HelloRequestResonseType = createMocks({ method });
    return { req, res };
  }

  it('should return a successful response from API', async () => {
    // Arrange
    const { req, res } = mockRequestResponse();

    // Act
    await helloHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ hello: 'Club 5' });
  });

  it('should return a 405 if HTTP method is not GET', async () => {
    // Arrange
    const { req, res } = mockRequestResponse('POST'); // Invalid HTTP call

    // Act
    await helloHandler(req, res);

    // Assert
    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({
      err: 'Method not allowed',
    });
  });
});
