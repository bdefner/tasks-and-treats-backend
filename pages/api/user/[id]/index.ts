import {NextApiRequest, NextApiResponse} from 'next';

export default function getUserById(req: NextApiRequest , res: NextApiResponse) {
  res.json({id: req.query.id, message: 'getUserById'})
}
