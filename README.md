# NC News Seeding

- In order for the code to run you must set up .env files. Create two files: '.env.development' and '.env.test' in the main directory.
- Once you have created each file, in the test file write: 'PGDATABASE = nc_news_test' and in the development file write: 'PGDATABASE = nc_news'.
- This will allow you to connect to each database locally as well as being able to run the commands specified in the package.json file.
- You can verify that they are correctly set up by running 'npm run test-seed' and 'npm run seed-dev', you should see console logs that show you have connected to the databases.
