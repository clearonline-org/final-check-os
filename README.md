# Final Check OS

Another API request monitoring tool - os for *Open Source*

## Goal
* Ensure System is providing correct results to the good user.
* Ensure System is providing correct error message to the bad user.

## Running Locally

* Clone the repository `git clone https://github.com/<final-check-path>`
* Fix config files
```bash
cp src/environments/environment.sample.ts src/environments/environment.ts
cp src/environments/environment.sample.ts src/environments/environment.prod.ts
# for prod, make sure to set "stubBackend" to false so that production code uses real backend
```
* Install dependancy `npm install`
* Run development server `npm start`

### Notes:
* We use a **Mock Service** to simulate the backend locally
```bash
# Look inside "src/stub-backend" folder
# You can turn it off by removing the "stubBackend" attribute inside "src/environments/environment.ts" file
```
* Testing credentials
```javascript
email: test@example.com
password: testTEST123*()
```

## Authentication
Final Check OS uses AWS cognito system for manage users, So if you are not familiar with it, I would recommend checking out this [tutorial](https://github.com/awslabs/aws-serverless-workshops/tree/master/WebApplication/2_UserManagement).
* Note: this is not necessary if you are running with the `stubBackend` environment variable set to `true`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Data Structure

* Application
```javascript
// application: represent the monitored system
{
  id: string,
  name: string,
  description: string,
  appcode: string // used by the logging systems when sending logs to Final Check backend
}
```

* Applicaton Summary
```javascript
// summary
{
  appId: string,
  appName: string,
  OK: number, // number of logs with status code of 200
  ERROR: number, // number of logs with status code of 500
  OTHER: number // number of logs with status code other than 200 or 500
}
```

* ApiRequest
```javascript
// api-request: represent the http request log (Final Check log)
{
  id: string,
  url: string,
  request: json,
  response: json,
  latency: number
}
```

* ApiRequest Origin
```javascript
// request-origin: used to display all call origins on a world map
{
  ip: string,
  ipOwner: string,
  long: string,
  lat: string,
  requestCount: number
}
```

## TODO
* Implementing the data structure above
* A map that shows locations of possible anomalies *error requests or bad clients* 
  * This goes to the dashboard page
* Fix API (design and implementation) for getting summarized data
* A map that shows locations of each each request of a selected application.


## License
BSD-3-Clause