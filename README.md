# Advanced-Analytics-Dashboard

## Project Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/jenish77/Advanced-Analytics-Dashboard.git
    ```

2. Navigate to the project directory:

    ```bash
    cd Advanced-Analytics-Dashboard
    ```

3. Install the dependencies:

    ```bash
    for client side to view dashboard
    cd client
    npm install
     
    for the inside server directory 
    cd server 
    npm install 

    for the machine learning model
    cd python-forecasting
    pip install flask prophet virtualenv pandas CORS
    activate virtual environment = myenv\Scripts\activate 
    ```

4. Start the development server:

    ```bash
    client = npm run dev
    server = npm start
    python-forecasting = pyhton app.py
    ```

```bash
for database use mongodb://localhost:27017/ this url for generating and store data
inside dashboard = mongodb://localhost:27017/dashboard table all data are stored 
```


    ```bash
    run seeder to generate fake data using faker
    move directory to sevrer/src = seeders/orderSeeder.js for generating order data
    move directory to sevrer/src = seeders/productSeeder.js for generating product data
    move directory to sevrer/src = seeders/transactionSeeder.js for generating transaction data
    move directory to sevrer/src = seeders/userSeeder.js for generating user data
    ```
    

5. Open your browser and visit `http://localhost:3000` to view the dashboard.
5. is for nodejs server `http://localhost:7000` to view the dashboard.
5. is for python server `http://localhost:5001` to view the dashboard.


## Description

This project is an advanced analytics dashboard that provides insights and visualizations for data analysis. It utilizes various technologies and libraries to deliver a powerful and user-friendly experience.

## Features

- Interactive charts and graphs
- Transactional Data Reporting
- AI-Powered Demand Forecasting
- Secure Payment Link Generation
- Data filtering and sorting
- Advanced Content Security
- also implement disable ctrl+c, ctrl+v, f12, not allow scraping, disable Right-click context menus and Preventing access to the application’s data from network tools

## Technologies Used

- nextjs
- Redux
- recharts
- python
- prophet
- faker
- Node.js
- Express
- MongoDB

## implementing machine learning model using below reference
- https://pypi.org/project/prophet/

## AI Forecasting
- this is image show the forecasting result from selected category 
![alt text](image.png)
![alt text](image-7.png)

-Below image show the transaction list.
![alt text](image-1.png)

-Below image is total user list
![alt text](image-2.png)

-Below image is for payment list
![alt text](image-3.png)

-Below image is for generate dynamic link for complete the payment
![alt text](image-4.png)

-Below image is for complete the transaction using that link
![alt text](image-5.png)

-after completeing the transaction status would be updated in the payment list
![alt text](image-6.png)

-static data for showing charts
![alt text](image-11.png)

- api for generating dynamic one time use payment link
![alt text](image-8.png)


-api for complete payment for transaction
![alt text](image-9.png)
![alt text](image-10.png)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
