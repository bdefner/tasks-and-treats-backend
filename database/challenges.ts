import crypto from 'node:crypto';
import { sql } from './connect';

export type Challenges = {
  challengeId: number;
  label: string;
  description: string;
  reward: number;
};

export async function GetAllChallenges() {
  const challenges = await sql<Challenges[]>`
  SELECT
    *
  FROM
    challenges
  `;

  return challenges;
}

// ToDo: The database will be changed to have an inner join table 'user_challenges' like this:
// user_id | challenge_id
// ------------------------
//      1  | .          1
//
// Then, the fetch will get the users challenges:
export async function GetUserChallenges(userId, sessionToken) {}

// Then, this function will add a userChallenge (once a specific one is accomplished, which has to be checked in the backend!)
export async function AddUserChallenge(userId, sessionToken) {}
