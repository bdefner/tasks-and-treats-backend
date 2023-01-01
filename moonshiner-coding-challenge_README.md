# The tasks

1. "Invite friends & family to the application + gain 10 (lazy) points"
2. "Sharing of the challenges - or dashboard with your friends - (maybe even a leaderboard)"

## Task #1 - Gain 10 stars for inviting friends to the app

### Pseudo code

1. - **In the backend**, I created an additional column "invite_token" in the user table of the database, which has to be unique to every user. On signup, the token is created using crypto and consits of a string of 10 characters (base64).
     I hab to update the api endpoints /signup, /login and /auth as well as the functions getUserByUsername(), createUser() and getUserBySessionToken() to create the token on signup and send the token to the frontend, when needed.
1. - As well, I created the api endpoint /usepromotion. This endpoint takes an inviteToken as well as a sessionToken as arguments. It checks (a) if the sessionToken is valid and which user is associated with it (userA), (b) if the inviteToken is valid and which user is associated with it (userB) and (c) if userA != userB. When passed the budget of userB gets updated by 10 stars by calling the function updateUserByInviteToken().
1. - Also in the backend, I added a (first to display) challenge, which asks the user to invite friends to the app by using the users inviteToken.
1. - **In the frontend**, I added some elements and styles to the component ChallengeItem.js: A field to display the inviteToken and a Button to trigger sharing. When pressed, a link to the app (on expo) and a text containing the inviteToken is passed.
1. - On signup, I created a new screen which appears after creating the user account. There the new user get's asked "How did you hear about this app" and get's to choose "Invited by a friend". If that option gets chosen, the user get's asked for the "invitation code" (= inviteToken), which she/he can paste inside. Then, the token gets fetched to the api endpoint /usepromotion as described above. If valid, the new user sees a message "<username of userB> received 10 stars!" while a Lottie animation is played and the current available challenges gets fetched from the backend.

### Code snips corresponding to the pseudo code above

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
