const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODE_EMAIL,
    pass: process.env.NODE_PASSWORD,
  },
});

module.exports.sendOrderConfirmation = async (email, order) => {
  console.log(`Attempting to send order confirmation to: ${email}`);
  const orderNumber = `LX-${order._id.toString().slice(-6).toUpperCase()}`;
  const total = order.totalbill || 0;

  const htmlContent = `
    <div style="font-family: 'serif', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; background-color: #fff;">
      <div style="text-align: center; border-bottom: 2px solid #c5a059; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #001f3f; margin: 0; font-style: italic;">LuxeStore</h1>
        <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px; color: #c5a059; margin-top: 5px; font-weight: bold;">The Archive of Excellence</p>
      </div>
      
      <h2 style="color: #001f3f; font-weight: normal; font-style: italic;">Acquisition Confirmed</h2>
      <p>Dear Valued Client,</p>
      <p>We are pleased to confirm that your order <strong>#${orderNumber}</strong> has been successfully placed and is now being curated by our boutique specialists.</p>
      
      <div style="background-color: #f9f9f9; padding: 25px; margin: 30px 0; border: 1px solid #eee;">
        <h3 style="text-transform: uppercase; letter-spacing: 2px; font-size: 11px; color: #c5a059; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0;">Order Summary</h3>
        <p style="font-size: 14px; margin: 15px 0;"><strong>Status:</strong> Processing</p>
        <p style="font-size: 14px; margin: 15px 0;"><strong>Total Value:</strong> ₹${total.toLocaleString('en-IN')}</p>
      </div>
      
      <p style="font-size: 14px; color: #666;">A digital certificate of authenticity and a detailed invoice will be available once your masterpieces have been dispatched.</p>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999;">Nariman Point, Mumbai | Maharashtra, India 400021</p>
        <p style="font-size: 10px; color: #ccc; margin-top: 10px;">Authenticity Guaranteed • Insured Transaction</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `LuxeStore <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: `Acquisition Confirmed - Order #${orderNumber}`,
      html: htmlContent,
    });
    console.log(`Order confirmation sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`SMTP Error for ${email}:`, error);
    throw error;
  }
};

module.exports.sendStatusUpdateEmail = async (email, order, status) => {
  const orderNumber = `LX-${order._id.toString().slice(-6).toUpperCase()}`;
  
  const statusMap = {
    processing: {
      title: "Preparation in Progress",
      message: "Your masterpieces are being meticulously curated and prepared for shipment by our boutique specialists.",
      icon: "✨"
    },
    shipped: {
      title: "In Transit",
      message: `Your acquisition has departed from our Mumbai hub. It is currently in the care of ${order.carrier || 'LuxePost Premium'}.`,
      icon: "✈️"
    },
    out_for_delivery: {
      title: "Arriving Today",
      message: "A specialized concierge is en route to your destination. Your masterpieces will be with you shortly.",
      icon: "🚚"
    },
    delivered: {
      title: "Acquisition Delivered",
      message: "We are pleased to confirm that your order has been successfully delivered and signed for.",
      icon: "💎"
    },
    cancel: {
      title: "Acquisition Cancelled",
      message: "Your order has been cancelled as per your request or due to transaction verification failure.",
      icon: "✖️"
    }
  };

  const currentStatus = statusMap[status] || { title: "Order Update", message: `Your order status has been updated to ${status}.`, icon: "ℹ️" };

  const htmlContent = `
    <div style="font-family: 'serif', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; background-color: #fff;">
      <div style="text-align: center; border-bottom: 2px solid #c5a059; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="color: #001f3f; margin: 0; font-style: italic;">LuxeStore</h1>
        <p style="text-transform: uppercase; letter-spacing: 3px; font-size: 10px; color: #c5a059; margin-top: 5px; font-weight: bold;">The Archive of Excellence</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-size: 40px;">${currentStatus.icon}</span>
        <h2 style="color: #001f3f; font-weight: normal; font-style: italic; margin-top: 10px;">${currentStatus.title}</h2>
      </div>

      <p>Dear Valued Client,</p>
      <p>${currentStatus.message}</p>
      
      <div style="background-color: #f9f9f9; padding: 25px; margin: 30px 0; border: 1px solid #eee;">
        <h3 style="text-transform: uppercase; letter-spacing: 2px; font-size: 11px; color: #c5a059; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0;">Shipment Details</h3>
        <p style="font-size: 14px; margin: 15px 0;"><strong>Order:</strong> #${orderNumber}</p>
        <p style="font-size: 14px; margin: 15px 0;"><strong>Status:</strong> <span style="text-transform: capitalize;">${status.replace(/_/g, ' ')}</span></p>
        ${order.trackingId ? `<p style="font-size: 14px; margin: 15px 0;"><strong>Tracking ID:</strong> <span style="color: #c5a059; font-family: monospace;">${order.trackingId}</span></p>` : ''}
        ${order.carrier ? `<p style="font-size: 14px; margin: 15px 0;"><strong>Carrier:</strong> ${order.carrier}</p>` : ''}
      </div>
      
      <p style="font-size: 14px; color: #666;">You may track the real-time progress of your acquisition through our digital concierge portal.</p>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999;">Nariman Point, Mumbai | Maharashtra, India 400021</p>
        <p style="font-size: 10px; color: #ccc; margin-top: 10px;">Authenticity Guaranteed • Insured Transaction</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `LuxeStore Concierge <${process.env.NODE_EMAIL}>`,
      to: email,
      subject: `LuxeStore Update: ${currentStatus.title} - Order #${orderNumber}`,
      html: htmlContent,
    });
    console.log(`Status update email sent to ${email} for status: ${status}`);
  } catch (error) {
    console.error(`Failed to send status update email to ${email}:`, error);
  }
};

module.exports.transporter = transporter;
