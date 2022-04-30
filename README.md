# Voting 

## \_ Election for school leadership position.

> Leadership Election! 🚀

Live Demo
Check out the live demo here: http://v.surge.sh/
![Voting Demo Image](Voting Demo.png)

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork Voting:

```bash
git clone https://github.com/Bg-Team-C/Voting.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd Voting 
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd Voting 
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd Voting 
yarn deploy
```

🔏 Edit your smart contract `Voting.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

This documentation is segmented into developer-focused messages and end-user-facing messages. These messages may be shown to the end user (the human) at the time that they will interact with the contract (i.e. sign a transaction).

@title - Title that describes the contract
<br/>
@author - Name of the author
<br/>
@notice - Explains to an end user what a function does
<br/>
@dev - Explains to a developer any extra details
<br/>
@param - Documents a single parameter from functions and events
<br/>
@return - Documents one or all return variable(s) from a function
<br/>

User and Developer Documentation can be found [here](https://github.com/Bg-Team-C/Voting/blob/master/documentation.json)

# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📧 Learn the [Solidity globals and units](https://docs.soliditylang.org/en/latest/units-and-global-variables.html)
