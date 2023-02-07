# Overcome
Overcome is a web application where anyone can start working out without judgement in a cozy and welcoming place. One of its main focus is the mental health aspect of exercises and you can even record journals of your journey :)

You can use the app here: http://100.25.221.19/
Or if you are solely interested in the back-end: http://100.25.221.19/api

## About
Overcome is a mental health focused fitness application. Below are the implemented features:

- Sign up
- Login
- Google OAuth login
- Persistent sessions using JSON Web Token
- Logout
- Show list of exercises on the database
- Create new exercises
- Create a new objective
- Update user's objective
- Show the user's sheet list
- Create new exercise sheet
- Insert exercises into exercise sheet
- Delete sheets
- Start a new workout based on the sheets the user has
- Save workout on the database
- See user's history of workouts
- Save cardio workouts
- Show the user their journal list
- Read older journals
- Edit older journals
- Delete older journals
- Create new journals

<br>

## Technologies
The following tools and frameworks were used in the construction of this back-end:
<p>
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" />
  <img src="https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white" />
</p>

<br>

## How to run
1. Create a root project called Overcome-Back
```bash
mkdir Overcome-Back
```
2. Clone this repository
3. Create .env.production based on .env.example
4. If you don't have docker and/or docker compose, please make sure you have both installed
5. Run docker compose
```bash
docker-compose up --build
```
6. After that, you can access the api through http://localhost:4000/
7. If you intend to run it with the front-end, please refer to the instructions at https://github.com/rodrigocqb/Overcome-Front

<br>

## API Documentation
### POST **/users/sign-up**
Body:
```json
{
  "name": "Rodrigo",
  "email": "rodrigocortibarros@gmail.com",
  "password": "top_secret"
}
```
Response:
- Invalid Body
```json
"status": 400
```
- Email is already registered
```json
"status": 409
```
- Account is created
```json
"status": 201
```
<br>

### POST **/users/sign-in**
Body:
```json
{
  "email": "rodrigocortibarros@gmail.com",
  "password": "top_secret"
}
```
Response:
- Invalid Body
```json
"status": 400
```
- Email and password do not match
```json
"status": 401
```
- User is logged in
```json
"status": 200
```
Response Body:
```json
{
  "id": 1,
  "name": "Rodrigo",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3NTUyNzU3NX0.dZG81oT6Ve0qDOtLyG-U_IR35W06gTyKDlYwkscYa_M"
}
```
<br>

### **All routes below are authenticated routes and will use an authorization header as shown below**
Instead of "token", use your own token acquired through the **/users/sign-in** route
```json
{
  "headers": {
    "Authorization": "Bearer token"
  }
}
```
#### If the user is not authorized, he will receive the following response
```json
"status": 401
```
<br>

### GET **/exercises/**
Response:
```json
"status": 200
```
Response Body:
```json
[
  {
    "id": 1,
    "name": "Bench Press",
    "createdAt": Date,
    "updatedAt": Date
  }
]
```
<br>

### GET **/exercises/:searchParam**
| Parameter  | Type     | Description                        |
| :---------- | :--------- | :---------------------------------- |
| `searchParam` | `string` | Will be used to find matching exercises|

<br>

- If no exercises match the searchParam:
```json
"status": 404
```
- If there is at least one matching exercise:

Response:
```json
"status": 200
```
Response Body:
```json
[
  {
    "id": 1,
    "name": "Bench Press",
    "createdAt": Date,
    "updatedAt": Date
  }
]
```
<br>

### POST **/exercises**
Body:
```json
{
  "name": "Bench Press",
}
```
- Invalid Body
```json
"status": 400
```
- Exercise already exists
```json
"status": 409
```
- Exercise is created
```json
"status": 201,
```
Response Body:
```json
{
  "id": 1,
  "name": "Bench Press",
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### GET **/objectives**
Response:
- User has no objective registered
```json
"status": 404
```
- User has an objective registered
```json
"status": 200
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "title": "Become stronger",
  "currentWeight": 60.5,
  "goalWeight": 65,
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### POST **/objectives**
Body:
```json
{
  "title": "Become stronger",
  "currentWeight": 60.5,
  "goalWeight": 65,
}
```
Response:
- Invalid Body
```json
"status": 400
```
- User already has an objective registered
```json
"status": 403
```
- Objective is registered
```json
"status": 201
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "title": "Become stronger",
  "currentWeight": 60.5,
  "goalWeight": 65,
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### PUT **/objectives**
Body:
```json
{
  "title": "Become stronger",
  "currentWeight": 60.5,
  "goalWeight": 65,
}
```
Response:
- Invalid Body
```json
"status": 400
```
- User does not have an objective registered yet
```json
"status": 404
```
- Objective is updated
```json
"status": 200
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "title": "Become stronger",
  "currentWeight": 60.5,
  "goalWeight": 65,
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### GET **/sheets**
Response:
```json
"status": 200
```
Response Body:
```json
[
  {
    "id": 1,
    "title": "Chest Day",
    "userId": 1,
    "createdAt": Date,
    "updatedAt": Date,
    "SheetExercise": [
      {
        "weight": 42.5,
        "reps": 8,
        "sets": 4,
        "Exercise": {
          "id": 1,
          "name": "Bench Press",
        }
      }
    ]
  }
]
```
<br>

### POST **/sheets**
Body:
```json
{
  "title": "Chest Day"
}
```
Reponse:
- Invalid Body
```json
"status": 400
```
- Sheet is created
```json
"status": 201
```
Response Body:
```json
{
  "id": 1,
  "title": "Chest Day",
  "userId": 1,
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### PUT **/sheets/:sheetId**
| Parameter  | Type     | Description                        |
| :---------- | :--------- | :---------------------------------- |
| `sheetId` | `number` | The id of the sheet you want to add exercises|

<br>

Body:
```json
{
  "exerciseBody": [
    {
      "exerciseId": 1,
      "weight": 42.5,
      "reps": 8,
      "sets": 4,
    }
  ]
}
```

Reponse:
- Sheet does not exist:
```json
"status": 404
```
- Sheet is not owned by the user
```json
"status": 403
```
- Invalid Body
```json
"status": 400
```
- Sheet is updated with exercises
```json
"status": 200
```
Response Body:
```json
{
  "count": 1
}
```
<br>

### DELETE **/sheets/:sheetId**
| Parameter  | Type     | Description                        |
| :---------- | :--------- | :---------------------------------- |
| `sheetId` | `number` | The id of the sheet you want to delete|

<br>

Response:
- Invalid Parameter
```json
"status": 400
```
- Sheet does not exist:
```json
"status": 404
```
- Sheet is not owned by the user
```json
"status": 403
```
- Sheet and its exercises are deleted
```json
"status": 204
```
<br>

### GET **/workouts**
Response:
```json
"status": 200
```
Response Body:
```json
[
  {
    "id": 1,
    "userId": 1,
    "sheetId": null,
    "cardio": "CYCLING",
    "createdAt": Date,
    "updatedAt": Date,
    "Sheet": null
  },
  {
    "id": 2,
    "userId": 1,
    "sheetId": 1,
    "cardio": null,
    "createdAt": Date,
    "updatedAt": Date,
    "Sheet": {
      "id": 1,
      "title": "Chest Day",
      "userId": 1,
      "createdAt": Date,
      "updatedAt": Date
    }
  }
]
```
<br>

### POST **/workouts**
Body:
```json
{
  "sheetId": 1,
  "cardio": null | undefined
}
```
or
```json
{
  "sheetId": null | undefined,
  "cardio": "CYCLING" | "RUNNING" | "SWIMMING"
}
```

Response:
- Invalid Body (or includes both or neither body params)
```json
"status": 400
```
- Sheet does not exist
```json
"status": 404
```
- Sheet is not owned by the user
```json
"status": 403
```
- Workout is registered
```json
"status": 201
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "sheetId": null,
  "cardio": "CYCLING",
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### GET **/journals**
Response:
```json
"status": 200
```
Response Body:
```json
[
  {
    "id": 1,
    "userId": 1,
    "text": "Lorem ipsum dolor",
    "createdAt": Date,
    "updatedAt": Date
  }
]
```
<br>

### POST **/journals**
Body:
```json
{
  "text": "Lorem ipsum dolor"
}
```

Response:
- Invalid Body
```json
"status": 400
```
- Journal is created
```json
"status": 201
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "text": "Lorem ipsum dolor",
  "createdAt": Date,
  "updatedAt": Date
}
```
<br>

### PUT **/journals/:journalId**
| Parameter  | Type     | Description                        |
| :---------- | :--------- | :---------------------------------- |
| `journalId` | `number` | The id of the journal you want to update|
<br>

Body:
```json
{
  "text": "Lorem ipsum"
}
```

Response:
- Invalid Parameter
```json
"status": 400
```
- Invalid Body
```json
"status": 400
```
- Journal does not exist
```json
"status": 404
```
- Journal is not owned by the user
```json
"status": 403
```
- Journal is updated
```json
"status": 200
```
Response Body:
```json
{
  "id": 1,
  "userId": 1,
  "text": "Lorem ipsum",
  "createdAt": Date,
  "updatedAt": Date
}
```

<br>

### DELETE **/journals/:journalId**
| Parameter  | Type     | Description                        |
| :---------- | :--------- | :---------------------------------- |
| `journalId` | `number` | The id of the journal you want to delete|
<br>

Response:
- Invalid Parameter
```json
"status": 400
```
- Journal does not exist
```json
"status": 404
```
- Journal is not owned by the user
```json
"status": 403
```
- Journal is successfully deleted
```json
"status": 204
```