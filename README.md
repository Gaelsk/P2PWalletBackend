# P2PWalletBackend

### Description

This is a simple P2P wallet system that allows users to credit their wallet using Paystack and also to transfer funds to others users' wallet.

### Instructions

- Clone this repository
- Add .env file
- Install dependencies (`npm install`)
- Run the project locally (`npm run dev`)

### .env
DB_NAME: YOUR DATABASE NAME
DB_HOST: YOUR DATABASE HOST
DB_DRIVER: YOUR DATABASE DRIVER
DB_USER: YOUR DATABASE USERNAME
DB_PASSWORD: YOUR DATABASE PASSWORD
PAYSTACK_SECRET_KEY: YOUR PAYSTACK SECRET KEY
SECRET_KEY: YOUR SECRET KEY FOR TOKEN

### API Documentation

- POST: /users/register (name, email, password)
- POST: /users/login (email, password)
- GET: /users/me (Provide Authorization Header `Bearer {{TOKEN}}`
- GET: /users

- POST: /wallets (amount)
- POST: /wallets/transfer (toUserId, amount)

#### Note: You can also find a frontend project that shows how this backend service works [HERE](https://github.com/Gaelsk/P2PWalletFrontend).
