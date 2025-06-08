import React from 'react';
import { Button } from '@mui/material';
import API from '../../utils/axios.jsx';
import loadRazorpayScript from '../../utils/loadRazorpayScript';

const PaymentButton = ({ data, type, onSuccess, disabled, buttonText }) => {
  const [loading, setLoading] = React.useState(false);
 const handlePay = async () => {
  try {
    setLoading(true);

    //  Build payload
    const payload = {
        amount: data.amount || data.rate,  // Prefer `data.amount` first since it's logged
        toUserId: data.toUserId || data.candidate?._id || data.mentor?._id || data.toUser?._id,
      purpose:
        type === 'hire'
          ? `Hiring for ${data.role}`
          : `Mentorship for ${data.mentor?.message || 'session'}`,
      mentorRequestId: type === 'mentor' ? data.mentorRequestId : undefined,
      hireId: type === 'hire' ? data._id : undefined,
    };
    if (!payload.amount || !payload.toUserId) {
      console.error("Missing required fields: amount or toUserId");
      alert("Invalid payment data.");
      return;
    }

    //  Create order
    const res = await API.post('/payments/create-order', payload);
    const { orderId, amount, currency } = res.data;

    // Load Razorpay
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to load Razorpay SDK');
      return;
    }

    //  Open payment modal
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency,
      name: 'DevConnect',
      description: payload.purpose,
      order_id: orderId,
      handler: async (response) => {
        try {
          const verifyRes = await API.post('/payments/verify-payment', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            alert('Payment successful!');
            if (onSuccess) onSuccess();
          } else {
            alert('Payment verification failed.');
          }
        } catch {
          alert('Error verifying payment.');
        }
      },
      theme: { color: '#0c64e8' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment initiation failed:', error);
    alert('Payment failed to initiate.');
  } finally {
    setLoading(false);
  }
};
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handlePay}
      disabled={disabled || loading}
      sx={{ ml: 1, mb: 0.4, borderRadius: 4 }}
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
};

export default PaymentButton;
