npm install

npm start

1. http://localhost:3000/user/register
x-www-form-urlencoded

name
surname
email
password (1Caps, min-length 8, number)

2. http://localhost:3000/user/login
x-www-form-urlencoded

email
password

3. http://localhost:3000/task/createTask
x-www-form-urlencoded

title
description
date

4. http://localhost:3000/task/query/getTasks
paramas:
sort : title/status/date   -> which field to sort by
status: 0/1/2
length: true/false  -> default false
sortOrder: asc/desc
date: YYYY-MM-DDT23:59:59,YYYY-MM-DDT23:59:59  -> search between these 2 dates

It is required to send Bearer token you recieve when loging in to create task.

Postman pre-request script:

const options = {
  url:  'http://localhost:3000/user/login', 
  method: 'POST',
  header: {
    'Accept': '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: {
    mode: 'urlencoded',
    urlencoded : [
        { key:"email", value:"andro.toplak2@gmail.com"},
        { key:"password", value:"Geslo123"}
    ]
  }
};

pm.sendRequest(options, function (err, res) {
  pm.environment.set("my-token", res.json().token);
});

Under Auth -> Chose Bearer token and add {{my-token}}
