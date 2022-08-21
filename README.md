# referral Code API

## Swagger: https://api-d6nu5avtaq-uc.a.run.app/api-docs/

## About

### What is this repo?

This is a Firebase Function + Express API for referral codes, with Firestore as the database.

### What can I do with the API?

- Create a new referral code using an existing one, this will link the newly created referral code with the one used in a tree like structure.
- Perfom an action using a referral code, this will update all the parents of the referral code with the action as well.
- View the referral code data: parent referral code, children referral code, data on children referral code actions.
- [WIP] Send lifecyle emails update. When someone created a referral code or performed an action using your referral code.

## Dev env setup

First, install the following **VSCode extensions**: ESLint, Jest, sort-imports, Prettier - Code formatter.

Then navigate to the repo using the terminal and install the depencencies:

```bash
npm run ci
```

Finally, run the development server:

```bash
npm run serve
```

You will also need to run unit tests before making a pull request or changing the tests with:

```bash
npm run test
```

## App Structure - Outdated

TODO - update this section

- **pages** - where all the pages are found.
- **components** - where all the commonly used components are found. Ex: button, links, input.
- **pages/api** - where the backend apis are found, mostly to interact with the database.

## Resources

**Firebase**:

- [Firebase Console](https://console.firebase.google.com/project/club-five-4ee6a/overview) - (you will need to request access to access this link) view stats about the website, manage resource and interact with the database.
- [Firestore Documentation](https://firebase.google.com/docs/reference/js/firestore_) - documentation on functions to interact with the firestore database.
