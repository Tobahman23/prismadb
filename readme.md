## Documentation of prisma database

This project was a experimental product to test the limits of nodejs etc.
The .env and schema.prisma are files that are necessary for connecting with the mysql database that is driven on mysql workbench and a community server. 

The package.json and the package-lock.json were both files mainly used in the setup for the project and the app.js was created as the main and only server file. 

In app.js multiple node modules like multer and ejs was set up for their own purposes. Multer was needed for image upload and with multer a storage could be set up to save selected images in the images folder. This was done in the create function where upload.single was used. The images folder was turned into a static folder that could be accessed from ejs files which had a view engine set up to make sure that the ejs files were more easily configured. 

The rest of the registration form was pretty straight forward. Via express the data of the index.ejs form could be transferred and stored with req and res as the arguments for the create function.

<img width="1138" alt="Screenshot 2022-12-21 at 13 56 15" src="https://user-images.githubusercontent.com/84333560/208910504-76f277b4-b9c9-46b1-8765-c64f35346dbc.png">
<br>
<img width="932" alt="Screenshot 2022-12-21 at 13 52 34" src="https://user-images.githubusercontent.com/84333560/208909841-63defbbb-d699-4290-8db7-6616927b45fd.png">

Password variables were hashed and the data was put into the prisma.(modelname).create function. After the account was created the user would be transferred to a page that told the user that their registration was succesful. 

The login/profile function had a username and a password input. When the user tries to login the prisma.(modelname).findUnique is used to find a account on the database where the username matches the given one. A if statement is declared to check if the user actually exist and if it doesn't then the user is sent to the login page once again where a error message of what went wrong is displayed.

<img width="889" alt="Screenshot 2022-12-21 at 14 01 27" src="https://user-images.githubusercontent.com/84333560/208911457-fe107ecb-0730-4867-bf1d-b423e2400f47.png">

The valid const is then made to see if the hashed and salted password on the database matches the given one via bcrypt.compare. An if statement is then
declared to check if the valid const is true or false. If it is true a session is created and session variables that are then put into res.locals are declared. After this the profile page is rendered where the users data is displayed. 

<img width="1440" alt="Screenshot 2022-12-21 at 14 13 25" src="https://user-images.githubusercontent.com/84333560/208913530-ea8584de-89a4-49e3-9fb6-ad2dd4d04c57.png">
<img width="978" alt="Screenshot 2022-12-21 at 14 14 15" src="https://user-images.githubusercontent.com/84333560/208913687-50efe3d8-1aa9-4e03-84ef-0ad1e77b3aa4.png">

The updatepass function is very simular to the login one the first difference is that the function immediatly checks if the given username is equal to the one in your session. If it is the code proceeds and otherwise you are given a error message that is sent via res.locals.errors (a self declared variable).
If the passwords are matching the valid const becomes true just like in the login function and prisma.(modelname).update is used to replace the password with the "data:" format. 

<img width="920" alt="Screenshot 2022-12-21 at 14 21 35" src="https://user-images.githubusercontent.com/84333560/208915045-bcf77cc5-bd72-4219-8f6e-0945278947e3.png">

The deleted function is almost identical to the updatepass one. The main difference is that prisma.(modelname).delete is called instead of 
prisma.(modelname).update. The only other real difference is that the session is destroyed after this (you are logged out).

<img width="916" alt="Screenshot 2022-12-21 at 14 25 29" src="https://user-images.githubusercontent.com/84333560/208915786-4730d3ef-c3d7-426b-bd1b-b3e7b175dee3.png">

The rest of the minor functions such as '/' are called mainly to redirect the user and check if a session is in order or not. 

The ejs files in the pages folder are all main ejs files that the user could get redirected to. The ejs files that lies in the partials folder are files that are included in the pages ejs files. This is done so the same code won't have to be rewritten multiple times. 

The allusers ejs file uses a bit of js/jquery. It makes users equal to the res.locals.allusers and sets a variable (i) to 0 that will be increased by +1 each time a new element is used in the foreach below. The foreach loop loops for each element in users. It makes a type variable that stringifies the current element and replaces all json characters and unnecessities. A types variable is called as a split up version of type so that the name and the username could be displayed in two different fields. A table row for each element (one name and one username) is made where the number of the row goes in one field, the name goes in one and the username goes in one. After the whole function is done the table is secluded. 

<img width="938" alt="Screenshot 2022-12-21 at 14 41 09" src="https://user-images.githubusercontent.com/84333560/208918936-56cae223-9f33-4553-a3f8-1f4bc1228c12.png">

The project works as expected and there is solid ground for possible upgrades or developments of the website. 
