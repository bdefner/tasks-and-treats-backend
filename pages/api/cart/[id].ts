import {NextApiRequest, NextApiResponse} from 'next';

export default function getCartById(req: NextApiRequest , res: NextApiResponse) {
  res.json({id: req.query.id, message: 'getCartById'})
}
