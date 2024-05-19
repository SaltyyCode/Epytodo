# EpyTodo

## Introduction

 This Epitech project was an introduction to web developpment.

The goal of the subject was to create the back-end of a todo app.

This project was made in group of 3, with my brothers Yanis "@Yasl290" & Killyan "@Ttkiks" weee sel3aaaa

## Installation

  In order to run epyTodo, you will have to install nodejs, npm and mysql.
  
  ### nodejs and npm
  
Run `sudo apt install nodejs npm -y` 
### App dependencies

 Install the app dependencies by running `npm install`.

### .env file

 You will also need to setup a `.env` file in the workspace containing the local configuration variable.

 The .env file should contain:

`PORT`, the port you decided to launch the app on.

`MYSQL_HOST`, the name of your host.

`MYSQL_USER`, your mysql user

`MYSQL_ROOT_PASSWORD`, your user password.

`MYSQL_DATABASE`, the database name, epytodo.

`SECRET`, a string, usually 32 bytes long used to generate the JWToken.

### Database

 Export the .sql file by running `cat epytodo.sql | mysql -u root -p`

### Start app

 Start sending requests after lauching the app using `node src/index.js` or `npm run start`

![331581874-eaafb945-952f-4861-82fb-e182541d12d4](https://github.com/SaltyyCode/Epytodo/assets/141867236/8d8c5337-eead-46d8-ab55-a0c6e2a2af28)

 
