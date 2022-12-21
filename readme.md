## Documentation of prisma database

This project was a experimental product to test the limits of nodejs etc.
The .env and schema.prisma are files that are necessary for connecting with the mysql database that is driven on mysql workbench and a community server. 

The package.json and the package-lock.json were both files mainly used in the setup for the project and the app.js was created as the main and only server file. 

In app.js multiple node modules like multer and ejs was set up for their own purposes. Multer was needed for image upload and with multer a storage could be set up to save selected images in the images folder. This was done in the create function where upload.single was used. The images folder was turned into a static folder that could be accessed from ejs files which had a view engine set up to make sure that the ejs files were more easily configured. 

The rest of the registration form was pretty straight forward. Via express and sessions the data of the index.ejs form could be transferred and stored via req and res.


<img width="932" alt="Screenshot 2022-12-21 at 13 52 34" src="https://user-images.githubusercontent.com/84333560/208909841-63defbbb-d699-4290-8db7-6616927b45fd.png">

