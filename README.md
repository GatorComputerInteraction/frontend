# Frontend

_Gator Computer Interaction (HCI Fall 2021)_

## Requirements

- [yarn](https://yarnpkg.com/)

### Recommended

- Some IDE to take advantage of Typescript (I recommend VS Code)
- The Redux Devtools Extension ([Chome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) / [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/))

## Getting Started

```
# Install dependencies
yarn install

# Setup linting githooks
yarn prepare

# Start dev server
yarn start

# Build production copy
yarn build

# Locally serve production website
yarn serve

```

### A note on building this project

This project uses a custom [webpack](https://webpack.js.org/) configuration for building. This is what powers the usual `create-react-app`, but is done custom for this project due to previous experiences with deploying production versions (CRA usually does a poor job). Therefore, if you're trying to import something and webpack seems to be causing issues, ping Chris to fix it (unless you really want to learn webpack).

## Navigating the Project

`src/index.tsx` is the entrypoint of the project, and configured the Redux state.

`src/App.tsx` sets up the routing for the project via react router.

`src/state` contains all Redux global state creation and actions.

`src/pages` contains all react router pages.

`src/components` should contain all app-specific components.

# Learning for this Project

Here's some good resources to work through if you're brand new to React and the greater modern Javascript ecosystem, or need a resource on a certain part of the project.

1. [Fundamentals of React](https://reactjs.org/tutorial/tutorial.html#overview)
2. [React Hooks (the syntax this project will use)](https://reactjs.org/docs/hooks-intro.html)
3. [The Basics of Typescript](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
4. [The Core Concepts of Redux (our state management framework)](https://redux.js.org/introduction/core-concepts)
5. [How Redux will Look with React](https://redux.js.org/tutorials/quick-start)
6. [Typescript with Redux (notice the `useAppSelector` and `useAppDispatch`)](https://redux.js.org/tutorials/typescript-quick-start)
7. [The Basics of React Router, Example](https://reactrouter.com/web/example/basic)
