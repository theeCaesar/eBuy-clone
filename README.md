# eBay Clone API

this is the backend api for the ebay clone project, built with express.js and mongodb

I made this project from scratch to gain some experience 
if u have any notes or advice please contact through my accounts in the contact section of this file

## Installation

To get started with this project, follow these steps:

1. Clone this repository to your local machine:

   ```shell
   git clone https://github.com/theeCaesar/eBuy-clone-api.git
   ```

2. Navigate to the project directory:

   ```shell
   cd eBuy-clone-api
   ```

3. Install the dependencies:

   ```shell
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following environment variables:

   ```
   PORT=3000
   MONGODB_URL= <your_mongodb_connection_url>
   NODE_ENV = development
   JWT_SECRET = <your_JWT_secret>
   JWT_EXPIRES_IN = <jwt expiers date> for ex: 60d
   JWT_COOKIE_EXPIRES_IN = <cookie expiers date> for ex: 60

   ADMIN_PASSWORD = <password to sign in admin users>
   USER_EMAIL = <>
   USER_EMAIL_PASSWORD = <>
   USER_EMAIL_HOST = <your email host> for ex: sandbox.smtp.mailtrap.io
   EMAIL_PORT = <>
   ```

5. Start the server (using nodemon):

   ```shell
   npm start
   ```

## Usage

### Endpoints

the endpoint with letter <span style="color:green">P</span> next to it means this url is protected (u need to be authorized)

#### some endpoints to get u started


- `POST /api/v1/user/signup`: create a new user.
- `POST /api/v1/user/login`: login existing user.
- `POST /api/v1/user/updateMyAccount` <span style="color:green">P</span> : update user info or user profile picture.
- `POST /api/v1/products/` <span style="color:green">P</span> : create product.
- `GET /api/v1/products/` : get products. check [utils/APIFeatures.js](https://github.com/theeCaesar/eBuy-clone-api/blob/master/utils/APIFeatures.js) to start using Query Params.


### Example Requests

#### create new user

`POST /api/v1/user/signup`

```json
{
    "displayName": "user",
    "password": "12345678",
    "passwordConform": "12345678",
    "email": "example@gmail.com",
}
```
a jwt token will be set as cookie

#### login user

`POST /api/v1/user/login`

```json
{
    "password": "123456789",
    "email": "example@gmail.com"
}
```
a jwt token will be set as cookie


#### update account info

`POST /api/v1/user/updateMyAccount`

u should be loged in as the user u want to update his info

```json
{
   "displayName": "user new display name"
}
```

u can update user pfp by sending image in form-data with key name "profilePicture"

#### create product

`POST /api/v1/products/` <span style="color:green">P</span>

u should send form-data with these keys:

<span style="color:yellow">images</span> : at least one image

<span style="color:yellow">coverImage</span> : only one cover image

<span style="color:yellow">json</span> : text contain with the json object as value

like:
{ "name" : "pc", "price": 300, "description": "old", "tags": ["tech"] }

`#updating products work the same way`

### for more endpints and information about the schemas I used, please consider reading the source code 


## Contact
If you have any questions or issues, u can find me through :

**Instagram** : [@moh_caeser](https://www.instagram.com/moh_caeser/)

**Github**: [theeCaesar](https://github.com/theeCaesar)

**telegram**: [@thee_caesar](t.me/thee_caesar)