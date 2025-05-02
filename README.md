# NC News Seeding
- Link to hosted version at: https://northcoders-news-ma.onrender.com
- The aim of this project is to demonstrate my ability to program the backend of a server host.
- Once you have cloned this repo there are a few this to set up before you are able to run it.
- In order for the code to run you must set up .env files. Create two files: '.env.development' and '.env.test' in the main directory.
- Once you have created each file, in the test file write: 'PGDATABASE = nc_news_test' and in the development file write: 'PGDATABASE = nc_news'.
- This will allow you to connect to each database locally as well as being able to run the commands specified in the package.json file.
- You can verify that they are correctly set up by running 'npm run test-seed' and 'npm run seed-dev', you should see console logs that show you have connected to the databases.
