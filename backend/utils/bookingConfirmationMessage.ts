export const bookingConfirmationMessage = (data: {
  userName: string;
  packageName: string;
  bookingId: string;
  amount: number;
}) => {
  const message = `<h2>Booking Confirmed 🎉</h2> 
  <p>Hello ${data.userName}</p> 
  <p>Your booking has been successfully confirmed</p>
  <p><strong>Package:</strong>${data.packageName}</p>
  <p><strong>BookingId:</strong>${data.bookingId}</p>
  <p><strong>Amount Paid:</strong>${data.amount}</p>
  <p>Thank you for booking with us.</p>`;

  return message;
};
