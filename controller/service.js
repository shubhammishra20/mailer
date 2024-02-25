const Email = require('../models/schemaEmail.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.APP_PASSWORD,
    },
});
// Create
module.exports.createMail = async (req, res) => {
    try {
        const emailData = req.body;

        // Send email using nodemailer
        await transporter.sendMail({
            from: emailData.from,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
            attachments:emailData.attachments
        });

        // Save email in the database
        emailData.sentAt = new Date();
        const email = await Email.create(emailData);

        res.status(201).json(email);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to send email'
        });
    }
}

// Route to list all failed/unsent scheduled emails
 module.exports.failedMail = async (req, res) => {
    try {
        const unsentEmails = await Email.find({ scheduledAt: { $ne: null }, sentAt: null });

        res.json(unsentEmails);
    } catch (error) {
        console.error('Error listing failed/unsent scheduled emails:', error);
        res.status(500).json({ error: 'Failed to list failed/unsent scheduled emails' });
    }
}

// Read by Id
 module.exports.getDataById = async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if(!email) {
            return res.status(404).json({ error: 'Data is not found' });

        }
        res.json(email);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// Update (Reschedule)
module.exports.rescheduleMail = async (req, res) => {
    try {
        const { _id } = req.params;
        const { scheduledAt, link } = req.body;

        // Find the email by ID
        const emailToUpdate = await Email.findById(_id);

        if (!emailToUpdate) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Update the scheduled time in the database
        emailToUpdate.scheduledAt = scheduledAt;
        await emailToUpdate.save();

        // Format the scheduledAt date in India time zone
        const formattedScheduledDate = new Date(scheduledAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
        });
        // Prepare nodemailer email options
        const mailOptions = {
            from: emailToUpdate.from,
            to: emailToUpdate.to,
            subject: emailToUpdate.subject,
            text: `Dear Candidate,\n\nYour meeting has been rescheduled. The updated date is: ${formattedScheduledDate}. Click to join: ${link}`,
            html: `<p>Dear Candidate,</p><p>Your meeting has been rescheduled. The updated date is:<b> ${formattedScheduledDate}</b>. Click <a href="${link}">here</a> for join meeting.</p><p>Best regards,<br/>Shubham Mishra</p>`,
            attachments: emailToUpdate.attachments,
        };

        // Send the email using nodemailer
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Email scheduled time updated and sent successfully' });
    } catch (error) {
        console.error('Error updating scheduled time and sending email:', error);
        res.status(500).json({ error: 'Failed to update scheduled time and send email' });
    }
}

// Delete
module.exports.deleteData = async (req, res) => {
    try {
        await Email.findByIdAndDelete(req.params.id);
        res.status(204).end("Deleted this mail");
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// List all emails
module.exports.getAllList =  async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}