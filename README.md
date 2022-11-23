# Tasks and Treats backend

This Next.js project serves as a backend and landingpage for the [Tasks and Treats react native expo app.](https://github.com/bdefner/tasks-and-treats-react-native-project)
However, feel free to use the api for your own projects if you wish to do so! The api allows user registration, login and authentication, as well as creating "carts" for users, containing a string, timestamp, due-date and additional columns as explained below. Carts can be connceted in ajoin table, so there's everything there for a chat or messanging app, for example.
Please make sure to use correct objects and types in your requests as listed below, since requests that do not meet these ctriteria will be rejected.

This project is deployed with fly.io on an alpine:18 machine:
https://tasks-and-treats-backend.fly.dev

## Technologies

Next.js, PostgreSQL, bcrypt, csrf, ley (for migrations), playwright (for testing)

## Request and respones Types

The following objects and types are used by the api.

`user: { userId: number; username: string; userEmail: string; sessionToken: string }`

`cart: { userId: number, timeOfCreation: Date, typeId: number, label: string, rating: number, dueDate: Date | null, statusId: number, assignedToUserId: number | null, receivedFromUserId: number | null, groupId: number | null }`

`challenges: { challengeId: number; label: string; description: string; reward: number; }`

## API Endpoints

All Endpoints only ecept request with method: POST.

### /api/signup

- Request body: 'username', 'email' and 'password'

- Response: 'userId', 'sessionToken'

### /api/login

- Request body: 'username', 'password'

- Response: 'userId', 'userEmail', budget, sessionToken

### /api/auth

- Request body: 'userId', 'sessionToken'

- Response: 'username, userId', 'userEmail', budget

### /api/logout

- Request body: 'userId', 'sessionToken'

- Response: 'success: "Session token deleted"

### /api/getcarts

fetches all carts associated with the userId

- Request body: 'userId', 'sessionToken'

- Response: 'carts'

### /api/getchallenges

The tasks and treats app has some challenges for the users. If the users acchieve those is checked in the backend.

- Request body: 'userId', 'sessionToken'

- Response: 'challenges'

### /api/createcart

- Request body: 'userId', 'sessionToken', 'timeOfCreation', 'typeId', 'label', 'rating', 'statusId'

- Response: 'cartId'

### /api/updatecart

- Request body: 'userId', 'sessionToken', 'timeOfCreation', 'typeId', 'label', 'rating', 'statusId'

- Response: 'cartId'

### /api/deletecart

- Request body: 'userId', 'sessionToken', 'cartId'

- Response: 'cartId'
