# IAGL Recruitment - NodeJS Assessment

## Context

Imagine a customer has a certain number of Avios points which they would like to redeem on an upcoming trip. They have decided to fly with British Airways and have navigated to their website (www.britishairways.com) in order to book a flight. Upon landing on the payment page, they should be presented with four price options (called price points) to choose from in order to use their Avios to discount the total price of the flight, or they can choose not to use any Avios.

These price points should be set percentages worth 20%, 50%, 70% or 100% of the price of the flight (the cash discount). The amount of Avios required for each price point will be calculated using a static value per Avios based on the flight route from the table below. There will be five key routes where a different rate is used, otherwise the default value of 0.02 should be used for all other routes.

| Departure Airport Code | Arrival Airport Code | Value per Avios |
|------------------------|---------------------|----------------|
| LHR                    | LAX                 | 0.028          |
| LHR                    | AMS                 | 0.025          |
| LHR                    | JFK                 | 0.03           |
| LGW                    | LAX                 | 0.027          |
| LGW                    | MUC                 | 0.024          |
| -                      | -                   | 0.02           |

## The Task
A REST web service needs to be created containing the logic to calculate the price points. Your API will be called by the website, and the response of the API (containing the price points) will be rendered by the website for the customer to choose from.

### API Contract
The API should expose one endpoint which will accept the following request data in order to do the calculation:

* DepartureAirportCode
* ArrivalAirportCode
* DepartureTime
* ArrivalTime
* Price
* Currency

The API should respond with the four price points, containing the calculated cash discount and the Avios amount for that price point.

### Technology
Please use any NodeJS framework and ReactJS. You may use any libraries and dependencies you wish to complete the task. Tips:

* Think about good, clean design and simulate, within reason, a production ready app.

### Deliverables

* _Mandatory_ - A production ready API that calculates the cash discount and the price point
* _Optional #1_ - A ReactJS application that emulates the creation of a small calculator for the API endpoint created in the step before.
* _Optional #2_ - A Docker Compose file designed to facilitate the execution of the API in conjunction with a PostgreSQL database within a local development environment. Ensure there is a table in your postgre database to read the table values described in the Context section.

To complete this assessment, you need to deliver the mandatory option and at least one of the Optional ones
Your finished code should be uploaded to your personal Github account and a link to this sent to the contact person.
