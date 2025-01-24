const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID',  // Replace with your Razorpay Key ID
  key_secret: 'YOUR_KEY_SECRET',  // Replace with your Razorpay Key Secret
});

// Payment route
app.post('/order', async (req, res) => {
  const amount = req.body.amount;

  const options = {
    amount: amount * 100,  // Amount in paise (100 paise = 1 INR)
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Capture payment route
app.post('/capture/:paymentId', async (req, res) => {
  const paymentId = req.params.paymentId;
  const amount = req.body.amount;

  try {
    const response = await razorpay.payments.capture(paymentId, amount * 100, 'INR');
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
