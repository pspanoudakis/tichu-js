# Tichu-JS

A single-player simulation of the famous [Tichu card game](https://en.wikipedia.org/wiki/Tichu)
which runs in the browser. \
There are many rule variations.
This particular implementation rules are described [here](http://www.gamecabinet.com/rules/Tichu.html).

While this project started as a motive to learn JavaScript & ReactJS
while also getting more familiar with basic HTML/CSS,
it ended up being interesting on its own way,
particularly during the card combinations logic implementation.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Online deployment
The game is currently deployed on [Netlify](https://www.netlify.com/), you can check it out
[here](https://lucid-williams-1b1e7c.netlify.app/). 


## Local deployment
- Node.js is required
- Clone the repository in your local machine
- `npm install`
- After the installation has been completed, run one of the scripts described below (in the project root directory):

## Available Scripts

- `npm start`

    Runs the app in the development mode.\
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

    The page will reload if you make edits.\
    You will also see any lint errors in the console.

- `npm test`

    Launches the test runner in the interactive watch mode.\
    See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

- `npm run build`

    Builds the app for production to the `build` folder.\
    It correctly bundles React in production mode and optimizes the build for the best performance. \
    The build is minified and the filenames include the hashes.

    See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

    If `npm run build` fails to minify, see the section [here](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).

- `npm run eject`

    **Note: this is a one-way operation. Once you `eject`, you can’t go back!**

    If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time.
    This command will remove the single build dependency from the project.

    Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc)
    right into the project so you have full control over them.
    All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them.
    At this point you’re on your own.

    You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments,
    and you shouldn’t feel obligated to use this feature.
    However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
    
## Project Structure
- Game logic & class implementations in `src` directory
- Component CSS stylesheets in `src/styles`
- Images are placed in `src/res`
- React component implementations in `src/components`

## Development & Testing
- Developed in Windows 10 environment, using Visual Studio Code & Node.js 14.15.5,
- Tested in Firefox Developer Edition 94, Microsoft Edge 93-94 & Google Chrome 93-94
