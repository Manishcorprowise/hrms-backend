const nodemailer = require('nodemailer');
const config = require('../config');



module.exports = {
    async sendEmailGmail(
      emailId,
      template,
      subject,
      cc = null,
      attachments = []
    ) {
      try {
        // console.log(config.USER_EMAIL,config.USER_PASSWORD);
        // return { status: false };
        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: true,
          port: 465,
          auth: {
            user: config.email.auth.user,
            pass: config.email.auth.pass,
          },
        });
        let mailOptions = {
          from: `"Kad Consulting Services HRMS" <${config.email.auth.user}>`,
          to: emailId,
          subject: subject,
          html: template,
        };
        if (cc) {
          mailOptions.cc = cc;
        }
        if (attachments.length > 0) {
          mailOptions.attachments = attachments;
        }
        await transporter.sendMail(mailOptions);
        return { status: true };
      } catch (error) {
        console.error("Error sending email:", error);
        return { status: false };
      }
    },
}