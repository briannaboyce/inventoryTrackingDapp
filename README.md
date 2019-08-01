# Inventory Tracking dApp
Inventory Tracking dApp Project for Fordham CISC 6880

Team Members:
Brianna Boyce

## Getting Started
### Tools Required
* NodeJS
* NPM
* Solidity 0.5.1
* Truffle
* Ganache
* Metamask
* Text editor (Sublime recommended with the Ethereum package)

### Install Tools
NodeJS/NPM: https://nodejs.org/en/
Truffle: `npm install -g truffle`
Ganache: https://www.trufflesuite.com/ganache
Metamask : https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

### Setup Fake Blockchain
1. Open Ganache
2. Follow prompts - fake blockchain should be up and running so long as Ganahche is open

### Setup Metamask
* Open Metamask extension and setup an account with password
* Once logged into Metamask, click on the "Networks" drop down (Should say something like, "Main Ethereum Network")
* Click "Add Custom RPC"
* In the URL field type "http://localhost:7545", Click "Save"
* Click on the circle in the top right corner and find the "Import Account" option
* Go to Ganache and from one of the listed accounts, click the key icon all the way on the right
* Copy the private key
* Paste it into the "Import Account" section on Metamask, Click "Import"

## Running the Project
### Migrate the Code
* Clone this repo locally
* In the project directory run `truffle migrate`

### Run Client App
* In the project directory run `npm run dev`
* App should start automatically in your web browser
* Ensure Metamask extenstion is enabled and running with the fake account
* Now the app should be up and running 


