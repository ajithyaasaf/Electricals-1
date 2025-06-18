import nodemailer from "nodemailer";
import { ServiceBooking, Order } from "@shared/schema";

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "noreply@electricals.com",
    pass: process.env.SMTP_PASS || "app_password",
  },
});

export const sendBookingConfirmation = async (booking: ServiceBooking) => {
  try {
    const mailOptions = {
      from: '"Electricals Madurai" <noreply@electricals.com>',
      to: booking.email || `${booking.phone}@sms.gateway.com`, // Fallback for SMS
      subject: "Service Booking Confirmation - Electricals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #ea580c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Electricals</h1>
            <p style="color: white; margin: 5px 0;">Premium Electrical Services</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Booking Confirmed! 🎉</h2>
            
            <p>Dear ${booking.name},</p>
            
            <p>Your service booking has been confirmed. Here are the details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #2563eb;">Service Details</h3>
              <p><strong>Booking ID:</strong> #${booking.id.slice(-8)}</p>
              <p><strong>Service Type:</strong> ${booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Service</p>
              <p><strong>Date & Time:</strong> ${booking.date} at ${booking.timeSlot.replace("-", ":00 - ")}:00</p>
              <p><strong>Address:</strong> ${booking.address}</p>
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ""}
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1d4ed8;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our technician will call you 30 minutes before arrival</li>
                <li>Please ensure someone is available at the scheduled time</li>
                <li>Keep necessary documents ready (if any)</li>
                <li>Payment can be made after service completion</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; color: #64748b;">Need to reschedule or have questions?</p>
              <p style="font-size: 18px; font-weight: bold; color: #2563eb;">📞 +91 98765 43210</p>
              <p style="font-size: 16px; color: #64748b;">Available 24/7 for emergencies</p>
            </div>
          </div>
          
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Thank you for choosing Electricals!</p>
            <p style="margin: 5px 0; font-size: 12px; color: #94a3b8;">123 Anna Salai, Madurai, Tamil Nadu - 625001</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation sent to ${booking.email || booking.phone}`);
  } catch (error) {
    console.error("Failed to send booking confirmation:", error);
    throw error;
  }
};

export const sendOrderConfirmation = async (order: Order) => {
  try {
    const mailOptions = {
      from: '"Electricals Madurai" <noreply@electricals.com>',
      to: order.shippingAddress.email || `${order.shippingAddress.phone}@sms.gateway.com`,
      subject: "Order Confirmation - Electricals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #ea580c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Electricals</h1>
            <p style="color: white; margin: 5px 0;">Premium Electrical Tools</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Order Confirmed! 📦</h2>
            
            <p>Dear ${order.shippingAddress.name},</p>
            
            <p>Thank you for your order. Here are the details:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #2563eb;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
              <p><strong>Total Amount:</strong> ₹${order.total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b;">Items Ordered</h3>
              ${order.items.map(item => `
                <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
                  <p style="margin: 0; font-weight: bold;">${item.name}</p>
                  <p style="margin: 5px 0; color: #64748b;">Quantity: ${item.quantity} × ₹${item.price.toLocaleString()}</p>
                </div>
              `).join("")}
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">Delivery Information</h3>
              <p style="margin: 0;">${order.shippingAddress.address}</p>
              <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
              <p style="margin: 0;">${order.shippingAddress.pincode}</p>
              <p style="margin: 10px 0 0 0; font-weight: bold;">Expected Delivery: 3-5 business days</p>
            </div>
          </div>
          
          <div style="background: #1e293b; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">Track your order or contact us anytime!</p>
            <p style="margin: 5px 0; font-size: 16px; font-weight: bold;">📞 +91 98765 43210</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation sent for order ${order.id}`);
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
    throw error;
  }
};

export const sendStatusUpdate = async (email: string, type: "order" | "booking", id: string, status: string) => {
  try {
    const subject = type === "order" ? "Order Status Update" : "Service Booking Update";
    
    const mailOptions = {
      from: '"Electricals Madurai" <noreply@electricals.com>',
      to: email,
      subject: `${subject} - Electricals`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb, #ea580c); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Electricals</h1>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b;">Status Update</h2>
            <p>Your ${type} #${id.slice(-8)} status has been updated to: <strong>${status.charAt(0).toUpperCase() + status.slice(1)}</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send status update:", error);
  }
};
