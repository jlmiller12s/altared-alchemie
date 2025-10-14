import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message, need, formType } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Validate email format
    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Build email body based on form type
    let emailBody = `New ${formType || 'Contact'} Form Submission\n\n`;
    emailBody += `Name: ${name}\n`;
    emailBody += `Email: ${email}\n`;
    
    if (need) {
      emailBody += `Primary Need: ${need}\n`;
    }
    
    if (message) {
      emailBody += `\nMessage:\n${message}\n`;
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Altared Alchemie <noreply@altaredalchemie.com>',
      to: ['jimmie@altaredalchemie.com'],
      replyTo: email,
      subject: `${formType || 'Contact'} Form: ${name}`,
      text: emailBody,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}

