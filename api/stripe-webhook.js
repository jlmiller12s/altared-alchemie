import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log('Payment successful:', session.id);
    
    // Extract customer details
    const customerEmail = session.customer_email;
    const customerName = session.metadata.customer_name;
    const platform = session.metadata.platform;
    
    // Generate download link based on platform
    const downloadLinks = {
      'windows': 'https://your-storage.com/devdoc-voice-generator-windows.exe',
      'mac-intel': 'https://your-storage.com/devdoc-voice-generator-mac-intel.dmg',
      'mac-arm': 'https://your-storage.com/devdoc-voice-generator-mac-arm.dmg'
    };
    
    const downloadUrl = downloadLinks[platform] || downloadLinks['windows'];
    
    // Generate a unique license key (you can use a library like uuid)
    const licenseKey = generateLicenseKey();
    
    // TODO: Send email with download link and license key
    // You'll need to integrate an email service here (SendGrid, Resend, etc.)
    await sendDownloadEmail({
      to: customerEmail,
      name: customerName,
      downloadUrl: downloadUrl,
      licenseKey: licenseKey,
      platform: platform
    });
    
    console.log(`Download email sent to ${customerEmail}`);
  }

  res.json({ received: true });
}

// Simple license key generator
function generateLicenseKey() {
  const segments = 4;
  const segmentLength = 4;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  let key = [];
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    key.push(segment);
  }
  
  return key.join('-');
}

// Email sending function with Resend
async function sendDownloadEmail({ to, name, downloadUrl, licenseKey, platform }) {
  try {
    const platformNames = {
      'windows': 'Windows (64-bit)',
      'mac-intel': 'macOS (Intel)',
      'mac-arm': 'macOS (Apple Silicon)'
    };
    
    const { data, error } = await resend.emails.send({
      from: 'Altared Alchemie <downloads@altaredalchemie.com>',
      to: to,
      subject: '🎉 Your Devdoc Voice Generator Download',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E82D05, #FF4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .license-box { background: #fff; border: 2px solid #E82D05; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .license-key { font-size: 24px; font-weight: bold; color: #E82D05; font-family: monospace; letter-spacing: 2px; }
            .download-btn { display: inline-block; background: #E82D05; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .instructions { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Thank You for Your Purchase!</h1>
              <p>Your Devdoc Voice Generator is ready to download</p>
            </div>
            
            <div class="content">
              <p>Hi ${name},</p>
              
              <p>Thank you for purchasing <strong>Devdoc Voice Generator</strong>! Your voice-powered documentation tool is ready to use.</p>
              
              <div class="license-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your License Key</p>
                <div class="license-key">${licenseKey}</div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Save this key - you'll need it to activate the app</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${downloadUrl}" class="download-btn">📥 Download for ${platformNames[platform] || platform}</a>
              </div>
              
              <div class="instructions">
                <h3 style="margin-top: 0; color: #E82D05;">Installation Instructions:</h3>
                <ol>
                  <li>Click the download button above</li>
                  <li>Run the installer for your platform</li>
                  <li>Enter your license key when prompted</li>
                  <li>Configure your keyboard shortcut</li>
                  <li>Start documenting with your voice!</li>
                </ol>
              </div>
              
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <strong>💡 Quick Tip:</strong> Set your keyboard shortcut to something easy like <code>Ctrl+Shift+D</code> for quick access while coding.
              </div>
              
              <h3>Need Help?</h3>
              <p>If you have any questions or need assistance:</p>
              <ul>
                <li>📧 Email: <a href="mailto:support@altaredalchemie.com">support@altaredalchemie.com</a></li>
                <li>📚 Documentation: <a href="https://altaredalchemie.com/resources">View User Guide</a></li>
              </ul>
              
              <p style="margin-top: 30px;">Happy documenting! 🎤</p>
              <p><strong>The Altared Alchemie Team</strong></p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Altared Alchemie. All rights reserved.</p>
              <p>This email was sent because you purchased Devdoc Voice Generator.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

