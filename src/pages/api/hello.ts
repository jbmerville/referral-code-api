import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  hello?: string;
  err?: string;
};

export default function helloHandler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  if (req.method === 'GET') {
    res.status(200).json({ hello: 'Club 5' });
  } else {
    res.status(405).json({ err: 'Method not allowed' });
  }
}
