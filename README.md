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
</p>

## How to run
1. Create a root project called Overcome-Back
```bash
mkdir Overcome-Back
```
2. Clone this repository
3. Create .env.production based on .env.example
4. If you don't have docker and/or docker compose, please install both
5. Run docker compose
```bash
docker-compose up --build
```
6. After that, you can access the api through http://localhost:4000/
7. If you intend to run it with the front-end, please refer to the instructions at https://github.com/rodrigocqb/Overcome-Front

