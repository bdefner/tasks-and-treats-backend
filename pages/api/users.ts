import {NextApiRequest, NextApiResponse} from 'next';

export default function getAllUsers(req, res) {

  if(req.method !== 'GET') {
    res.status(405).json({message: 'This route only allows the method GET'})
  }
  res.json({hello: 'world', method: req.method})
}
