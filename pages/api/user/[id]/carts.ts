import {NextApiRequest, NextApiResponse} from 'next';

export default function getAllCartsByUserId(req: NextApiRequest , res: NextApiResponse) {
  res.json({id: req.query.id, message: 'getAllCartsByUserId'})
}
