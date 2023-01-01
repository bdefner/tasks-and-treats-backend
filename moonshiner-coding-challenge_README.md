# The tasks

1. "Invite friends & family to the application + gain 10 (lazy) points"
2. "Sharing of the challenges - or dashboard with your friends - (maybe even a leaderboard)"

## Task #1 - Gain 10 stars for inviting friends to the app

### Description

1. - **In the backend**, I created an additional column "invite_token" in the user table of the database, which has to be unique to every user. On signup, the token is created using crypto and consits of a string of 10 characters (base64).
     I hab to update the api endpoints /signup, /login and /auth as well as the functions getUserByUsername(), createUser() and getUserBySessionToken() to create the token on signup and send the token to the frontend, when needed.
1. - As well, I created the api endpoint /usepromotion. This endpoint takes an inviteToken as well as a sessionToken as arguments. It checks (a) if the sessionToken is valid and which user is associated with it (userA), (b) if the inviteToken is valid and which user is associated with it (userB) and (c) if userA != userB. When passed the budget of userB gets updated by 10 stars by calling the function updateUserByInviteToken().
1. - Also in the backend, I added a (first to display) challenge, which asks the user to invite friends to the app by using the users inviteToken.
1. - **In the frontend**, I added some elements and styles to the component ChallengeItem.js: A field to display the inviteToken and a Button to trigger sharing. When pressed, a link to the app (on expo) and a text containing the inviteToken is passed.
1. - On signup, I created a new screen which appears after creating the user account. There the new user get's asked "How did you hear about this app" and get's to choose "Invited by a friend". If that option gets chosen, the user get's asked for the "invitation code" (= inviteToken), which she/he can paste inside. Then, the token gets fetched to the api endpoint /usepromotion as described above. If valid, the new user sees a message "<username of userB> received 10 stars!" while a Lottie animation is played and the current available challenges gets fetched from the backend.

### Code snips corresponding to the description above

1 - In postgreSQL: create table user with invite_token

```
CREATE TABLE users(
  user_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(70) NOT NULL UNIQUE,
  email varchar(70) NOT NULL,
  password_hash varchar (100) NOT NULL,
  budget integer,
  invite_token varchar(10) NOT NULL UNIQUE
```

in the /signup endpoint:

```
// Create an inviteToken

const inviteToken = cryptoRandomString({ length: 10, type: 'base64' });

// Create user with inviteToken

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
  budget: number,
  inviteToken: string,
) {
  const [userWithoutPasswordHash] = await sql<UserWithoutPasswordHash[]>`
  INSERT INTO users
    (username, email, password_hash, budget, invite_token)
  VALUES
  (${username}, ${email}, ${passwordHash}, 0, ${inviteToken})
  RETURNING
    user_id,
    username,
    email,
    budget,
    invite_token
  `;

  // return the user without the password_hash!
  return userWithoutPasswordHash;
}

    const userWithoutPasswordHash = await createUser(
      parsedRequestBody.username,
      parsedRequestBody.email,
      passwordHash,
      0,
      inviteToken,
    );


```

2 - in the /usepromotion endpoint

```
// Check if the request contains a session token

  if (!parsedRequestBody.sessionToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'No session token passed' }] });
    return;
  }

  const user = await getUserBySessionToken(parsedRequestBody.sessionToken);

  if (!user) {
    response
      .status(400)
      .json({ errors: [{ message: 'Session token not valid' }] });
    return;
  }

  // Check if the request body contains an inviteToken

  if (!parsedRequestBody.inviteToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'inviteToken is missing' }] });
  }

  // Try to update budget on user of inviteToken

  const userOfInviteToken = await updateUserByInviteToken(
    parsedRequestBody.inviteToken,
  );

  if (!userOfInviteToken.user) {
    response.status(400).json({ errors: [{ message: 'invalid inviteToken' }] });
  }

  // Response of successful request

  response.status(200).json({ user: { username: userOfInviteToken.username } });
```

in database/users.ts

```

export async function updateUserByInviteToken(InviteToken: string) {
  const [user] = await sql<User[]>`
  UPDATE
    users
  SET
    budget= budget +10
  WHERE
    invite_token = ${InviteToken}
  RETURNING
    username
  `;
  return user;
}
```

3 - New challenge (used as used in 1668523836-create-challenges.js)

```
const challenges = [
  {
    label: '🤙 Spread the news',
    description:
      'Invite a friend to use this app and receive your rewards, when this code is used on registration:',
    reward: 10,
  },...];

  exports.up = async (sql) => {
  await sql`
  INSERT INTO challenges ${sql(challenges, 'label', 'description', 'reward')}
`;
};
```

4 - Add elements in ChallengeItem.js

```
 {challenge.item.challengeId === 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                ...styles.labelWrap,
                backgroundColor:
                  Math.sign(challenge.item.reward) === 1
                    ? colors.green_2
                    : colors.purple_2,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>
                {Global.inviteToken}
              </Text>
            </View>
            <Pressable
              onPress={() => onShare(Global.username, Global.inviteToken)}
              style={styles.inMessageButton}
            >
              <Text style={{ color: 'white' }}>Copy & Share</Text>
            </Pressable>
          </View>
        )}
```

5 - New Screen after signup: AfterRegistrationScreen.js

```
async function UpdateBudgetByInviteToken(inviteToken) {
  const sessionToken = await SecureStore.getItemAsync('sessionToken');
  const apiUrl = `${globals.apiBaseUrl}/usepromotion`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'content-type': 'application/json',
        mode: 'no-cors',
      },
      body: JSON.stringify({
        sessionToken: sessionToken,
        inviteToken: inviteToken,
      }),
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }

}

export default function AfterRegistration({ route }) {
  const [inviteToken, setInviteToken] = useState('');
  const [showPromotionInput, setShowPromotionInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  console.log('route.params: ', route.params);

  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Welocome {route.params.user.username}</Text>

      <Lottie
        source={require('../assets/grafics/goodbyeAnimation.json')}
        autoPlay
        loop={false}
        style={styles.lottieAnimation}
      />

      <Text>How did you hear about this app?</Text>
      <View style={{ margin: spacing.medium_2, alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            setShowPromotionInput(true);
          }}
          style={{ ...styles.selectionWrap, backgroundColor: colors.purple_1 }}
        >
          <Text style={{ textAlign: 'center', color: 'white' }}>
            Got invited by a friend
          </Text>
        </Pressable>
        {showPromotionInput && (
          <>
            <View style={styles.promoWrap}>
              <Text style={{ margin: spacing.medium_1 }}>
                Did you receive a promotion code?
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    ...styles.inputFieldWrap,
                    backgroundColor: 'white',
                  }}
                >
                  <TextInput
                    style={{
                      ...styles.inputField,
                      color: colors.grey,
                      textAlign: 'center',
                    }}
                    placeholder="promo code"
                    onChangeText={setInviteToken}
                    autoCorrect={false}
                  />
                </View>

                <Pressable
                  onPress={async () => {
                    const response = await UpdateBudgetByInviteToken(
                      inviteToken,
                    );

                    if (!response.user) {
                      setErrorMessage(
                        'Sorry, we could not verify your code. You can click on "skip" or contact us for support. ',
                      );
                    } else {
                      setErrorMessage('');
                      navigation.replace('FetchUserDataAndRedirect', {
                        user: route.params.user,
                        promotionUser: response.user.username,
                      });
                    }
                  }}
                  style={{
                    ...styles.promoButton,
                    backgroundColor: colors.green_1,
                  }}
                >
                  <Text style={{ color: 'white' }}>Send</Text>
                </Pressable>
                <Pressable style={{ ...styles.promoButton }}>
                  <Text>Skip</Text>
                </Pressable>
              </View>
            </View>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </Text>
          </>
        )}
        <Pressable
          onPress={() => {
            setShowPromotionInput(false);
          }}
          style={{
            ...styles.selectionWrap,
            backgroundColor: colors.green_1,
            opacity: showPromotionInput ? 0.5 : 1,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'white' }}>
            Found it on the Expo store
          </Text>
        </Pressable>
        <Pressable
          style={{
            ...styles.selectionWrap,
            borderColor: 'black',
            borderRadius: 1,
          }}
        >
          <Text style={{ textAlign: 'center', color: 'blue' }}>
            Somehow else
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### Screenshots

3 - The challenge in "Challenges"

![](/public/moonshiner-new-challenge.png)

5 - AfterRegistrationScreen

![](/public/moonshiner-signup.png)

## Task 2 - Dashboard and Leaderboard

### Description

1. - **In the backend**, there is a new table "connections", containing an id, "user_requested_id" for the user who requested the connection, "user_received_id" for the user who received the invitation to connect, as well as a connection_token, which is used to confirm a connection.
2. - There is a new api endpoint /api/handleconnections. After checking for the correct method, for a valid sessionToken, checking and if the sessionToken is associated with the userId of the user sending the request, the request.Body is checked for "requestType". This has to either be "createConnection", "acceptConnection" or "getConnectionData".
3. - "createConnection" returns a connectionToken, which
4. - can be used in "acceptConnection" by a different user.
5. - "getConnectionData" is used to respond an array, consisting of the usernames and the budget of stars of the connected user, which is then used in the frontend.
6. - **In the frontend**, in the dashboard a new connection can be requested on the Dashboard screen, by clicking on [+Add]. This triggers a share function with a connection token in the content.
7. - Another user can accept this request, by pasting the token into the Inputfield with the placeholder "invitation code" on the dashboard screen and clicking on [Confirm].
8. - Once connections are set, the Data is fetched on login and the ranking is displayed on the dashboard -> leaderboard.

### Code snips corresponding to the description above

1. -

new table:

```
CREATE TABLE connections(
    connection_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_requested_id integer REFERENCES users (user_id) ON DELETE CASCADE,
    user_received_id integer REFERENCES users (user_id) ON DELETE CASCADE,
    connection_token varchar(10) UNIQUE NOT NULL

```

new api endpoint api/handleconnections:

```
import cryptoRandomString from 'crypto-random-string';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  acceptConnectionRequest,
  createConnectionRequest,
  getConnectionsByConnectionToken,
  getConnectionsByUserId,
} from '../../database/connections';
import {
  getUserBudgetByUserId,
  getUserBySessionToken,
} from '../../database/users';

type SignupResponseBody =
  | { errors: { message: string }[] }
  | { user: { userId: number } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
) {
  // Check for method

  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  } else {
    // Check if the body is parsed

    let parsedRequestBody = request.body;

    try {
      parsedRequestBody = JSON.parse(request.body);
    } catch (error) {
      console.log(error);
    }

    if (!parsedRequestBody.userId || !parsedRequestBody.sessionToken) {
      response.status(400).json({
        errors: [
          {
            message: 'Bad request: userId or sessionToken not provided!',
          },
        ],
      });
    }

    // Check if the sessionToken is valid

    const user = await getUserBySessionToken(parsedRequestBody.sessionToken);

    console.log('user:', user);
    if (!user) {
      response
        .status(401)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }

    // // Check if userId is associated with the sessionToken

    if (user.userId !== parseInt(parsedRequestBody.userId)) {
      response.status(401).json({
        errors: [
          { message: 'Could not verify the user. Better luck next time!' },
        ],
      });
      return;
    }

    // Check for valid request type

    if (!parsedRequestBody.requestType) {
      response
        .status(401)
        .json({ errors: [{ message: 'requestType not provided' }] });
      return;
    }

    // Successful request: Check for type request

    if (parsedRequestBody.requestType === 'createConnection') {
      const connectionToken = cryptoRandomString({
        length: 10,
        type: 'base64',
      });

      const connection = await createConnectionRequest(
        user.userId,
        connectionToken,
      );

      response.status(200).json(connectionToken);
    }
    if (parsedRequestBody.requestType === 'acceptConnection') {
      if (!parsedRequestBody.connectionToken) {
        response
          .status(401)
          .json({ errors: [{ message: 'connectionToken not provided' }] });
        return;
      }

      // Check if connectionToken is valid

      const testConnection = await getConnectionsByConnectionToken(
        parsedRequestBody.connectionToken,
      );

      if (
        !testConnection ||
        testConnection.userReceivedId ||
        testConnection.userRequestedId === parseInt(parsedRequestBody.userId)
      ) {
        response
          .status(401)
          .json({ errors: [{ message: 'connectionToken invalid' }] });
        return;
      } else {
        const newConnection = await acceptConnectionRequest(
          user.userId,
          parsedRequestBody.connectionToken,
        );
        response.status(200).json(newConnection);
        return;
      }
    }
    if (parsedRequestBody.requestType === 'getConnections') {
      const connections = await getConnectionsByUserId(
        parsedRequestBody.userId,
      );
      console.log('connections in Backend', connections);
      response.status(200).json(connections);
      return;
    }

    if (parsedRequestBody.requestType === 'getConnectionsData') {
      const ArrayOfConnectionUserIds = parsedRequestBody.connections.split(',');
      if (!parsedRequestBody.connections || !parsedRequestBody.connections[0]) {
        response
          .status(401)
          .json({ errors: [{ message: 'no connections sent' }] });
        return;
      }

      // Get name and budget of connections

      // Mapping doesn't work for any reason, so I used a for loop
      // const connectionData = await ArrayOfConnectionUserIds.map(
      //   async (item) => {
      //     await getUserBudgetByUserId(item);
      //   },
      // );

      const connectionData = [];

      for (let i = 0; i < ArrayOfConnectionUserIds.length; i++) {
        connectionData[i] = await getUserBudgetByUserId(
          ArrayOfConnectionUserIds[i],
        );
      }

      response.status(200).json(connectionData);
    }

    response.status(401).json({ errors: [{ message: 'invalid request' }] });
    return;
  }
}

```

6. / 7. / 8.

```
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useContext, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CartsContext from '../utils/context/CartsContext';
import globals, { userId } from '../utils/globals';
import { colors, font, spacing } from '../utils/styleConstants';

async function handleCreateNewConnectionRequest(userId) {
  const sessionToken = await SecureStore.getItemAsync('sessionToken');
  const apiUrl = `${globals.apiBaseUrl}/handleconnections`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'content-type': 'application/json',
        mode: 'no-cors',
      },
      body: JSON.stringify({
        userId: userId,
        sessionToken: sessionToken,
        requestType: 'createConnection',
      }),
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }

  return response;
}
async function handleConfirmConnection(userId, connectionToken) {
  const sessionToken = await SecureStore.getItemAsync('sessionToken');
  const apiUrl = `${globals.apiBaseUrl}/handleconnections`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'content-type': 'application/json',
        mode: 'no-cors',
      },
      body: JSON.stringify({
        userId: userId,
        sessionToken: sessionToken,
        requestType: 'acceptConnection',
        connectionToken: connectionToken,
      }),
    });
    const json = await response.json();

    return json;
  } catch (error) {
    console.log(error);
  }

  return response;
}

async function onShare(connectionToken) {
  try {
    const result = await Share.share({
      message: `Let's challenge: ${connectionToken}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
}

export default function Dashboard({ route }) {
  const user = route.params.user;
  const [carts, setCarts] = useContext(CartsContext);
  const navigation = useNavigation();
  const [connectionToken, setConnectionToken] = useState('');
  const [ranking, setRanking] = useState(() => {
    console.log('globals.connections[0]: ', globals.connections[0]);
    if (globals.connections[0]) {
      const rankingData = globals.connections;
      rankingData.push([{ budget: user.budget, username: user.username }]);

      const sortedRankingData = []
        .concat(rankingData)
        .sort((a, b) => (a.budget > b.budget ? 1 : -1));
      return sortedRankingData;
    } else {
      return [0];
    }
  });
  const [displayConnections, setDisplayConnections] = useState(
    ranking[0][0].budget === 0 ? false : true,
  );

  console.log('ranking: ', ranking);

  const activeTasks = carts.filter((item) => {
    return item.typeId === 1 && item.statusId === 1 && !item.groupId;
  });

  const activeTreats = carts.filter((item) => {
    return item.typeId === 2 && item.statusId === 1 && !item.groupId;
  });

  return (
    <ScrollView style={styles.screen}>
      <View>
        <View style={styles.chipWrap}>
          <View
            style={{
              ...styles.chip,
              backgroundColor: 'white',
              flexDirection: 'row',
            }}
          >
            <Text style={{ ...styles.chipCount, color: 'black' }}>
              {user.budget}
            </Text>
            <Image
              source={require('../assets/icons/star.png')}
              style={{
                width: spacing.medium_3,
                height: spacing.medium_3,
                marginLeft: spacing.small,
              }}
            />
          </View>
          <View style={{ ...styles.chip, flexDirection: 'row' }}>
            <Image
              source={require('../assets/icons/profile.png')}
              style={{
                width: spacing.medium_2,
                height: spacing.medium_2,
                marginRight: spacing.small,
              }}
            />
            <Text style={styles.h1}>{user.username}</Text>
          </View>
        </View>
      </View>
      <View style={styles.chipWrap}>
        <Pressable
          onPress={() => {
            navigation.navigate('Tasks');
          }}
          style={{ ...styles.chip, backgroundColor: colors.green_2 }}
        >
          <Text style={styles.chipHeading}>Tasks</Text>
          <Text style={styles.chipCount}>{activeTasks.length}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('Treats');
          }}
          style={{ ...styles.chip, backgroundColor: colors.purple_2 }}
        >
          <Text style={styles.chipHeading}>Treats</Text>
          <Text style={styles.chipCount}>{activeTreats.length}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate('Challenges');
          }}
          style={{ ...styles.chip, backgroundColor: colors.black }}
        >
          <Text style={styles.chipHeading}>Challenges</Text>
          <Text style={styles.chipCount}>2 / 12</Text>
        </Pressable>
      </View>
      <Text style={{ ...styles.h2, marginTop: spacing.large_1 }}>
        Leaderboard
      </Text>
      {displayConnections &&
        ranking.map((element, index) => {
          return (
            <View key={index}>
              <View
                style={{
                  ...styles.rankingListElementWrap,
                  backgroundColor:
                    index === 0 ? colors.green_1 : colors.green_3,
                }}
              >
                <Text style={{ fontSize: font.size_3, color: 'white' }}>
                  {index === 0 && '👑 '}
                  {ranking[index][0].username}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../assets/icons/star.png')}
                    style={{
                      width: spacing.medium_1,
                      height: spacing.medium_1,
                      marginLeft: spacing.small,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: spacing.small,
                      color: 'white',
                      fontSize: font.size_3,
                    }}
                  >
                    {ranking[index][0].budget}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: spacing.medium_2,
        }}
      >
        <TextInput
          style={{
            ...styles.inputField,
            color: colors.grey,
            textAlign: 'center',
          }}
          placeholder="invitation code"
          onChangeText={setConnectionToken}
          autoCorrect={false}
        />
        <Pressable
          onPress={async () =>
            await handleConfirmConnection(user.userId, connectionToken)
          }
          style={{
            ...styles.promoButton,
            backgroundColor: colors.purple_1,
            borderColor: colors.purple_1,
          }}
        >
          <Text style={{ color: 'white' }}>Confirm</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            const connectionToken = await handleCreateNewConnectionRequest(
              user.userId,
            );

            onShare(connectionToken);
          }}
          style={styles.promoButton}
        >
          <Text>+ Add</Text>
        </Pressable>
        <View></View>
      </View>
    </ScrollView>
  );
}

```

### Screenshots

![](/public/moonshiner-dashboard.png)
