# referral Code API

## About

### What is this repo?

This is a Node, NextJS API for referral codes, with Firestore as the database. The API is also bundled with a few React/NextJS components to be used as a starter repo for the client.

### What can I do with the API?

- Create a new referral code using an existing one, this will link the newly created referral code with the one used in a tree like structure.
- Perfom an action using a referral code, this will update all the parents of the referral code with the action as well.
- View the referral code data: parent referral code, children referral code, data on children referral code actions.
- [WIP] Send lifecyle emails update. When someone created a referral code or performed an action using your referral code.

## Getting Started

First, install the following **VSCode extensions**: ESLint, Jest, sort-imports, Prettier - Code formatter.

Then navigate to the repo using the terminal and install the depencencies:

```bash
npm run ci
```

Finally, run the development server:

```bash
npm run dev
```

You will also need to run unit tests before making a pull request or changing the tests with:

```bash
npm run test
```

The app (frontend + backend) will then be running at http://localhost:3000/

## API endpoints

### POST api/putReferral

Endpoint to sign up for a new referral code. You will need to give a referral code that already exist. The data you pass is then saved in the database and get be accessed using the GET api/getRerral endpoint.

_Sample body_:

```json
{
  "cryptoAddress": "1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix",
  "referralCode": "TEST",
  "twitterUsername": "",
  "discordUsername": ""
}
```

### GET api/getReferral/{REFERRAL-CODE}

Endpoint to retrieve data about a referral code.

## App Structure

- **pages** - where all the pages are found.
- **components** - where all the commonly used components are found. Ex: button, links, input.
- **pages/api** - where the backend apis are found, mostly to interact with the database.

## Resources

**NextJS**: react library used to build a react app using server rendering. This allows the website to be cached by CDN => load faster + google search much more likely to be successful

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

**Firebase**:

- [Firebase Console](https://console.firebase.google.com/project/club-five-4ee6a/overview) - (you will need to request access to access this link) view stats about the website, manage resource and interact with the database.
- [Firestore Documentation](https://firebase.google.com/docs/reference/js/firestore_) - documentation on functions to interact with the firestore database.
