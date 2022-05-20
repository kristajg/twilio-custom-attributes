require('dotenv').config();

import http from 'http';
import express from 'express';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Send custom attributes in an SMS via query strings

// Assume the campaign variable is coming from
// a dynamic source, such as a CRM or database
let dynamicCampaignVariable = 22;

// Twilio's node helper library to sends an SMS message
// we can add the campaign variable to the statusCallback
twilioClient.messages.create({
  to: process.env.MY_PHONE_NUMBER,
  from: process.env.TWILIO_PHONE_NUMBER,
  body: 'Super cool text for a super cool campaign',
  statusCallback: `https://YOUR_NGROK_URL_GOES_HERE.ngrok.io/sms-status-callback?campaign_id=${dynamicCampaignVariable}`,
})
.then(message => {
  console.log('Message sent: ', message);
})
.catch(err => {
  console.log('Message failed to send: ', err);
});


// StatusCallback endpoint
app.post('/sms-status-callback', (req, res) => {
  console.log('statusCallback hit. SMS status: ', req.body.SmsStatus);

  // Get metadata from the query string
  console.log('Metadata: ', req.query);

  // Send it to a database, do whatever you gotta do!
  let statusCallbackData = req.query;
});

app.get('/', (req, res) => {
  res.send('Test Twilio Sandbox is online!');
});

http.createServer(app).listen(8080, () => {
  console.log('Express server listening on port 8080');
});
