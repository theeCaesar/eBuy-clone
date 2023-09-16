//this part is for testing in development env

const nodemailer = require('nodemailer');

module.exports = class Emil {
  constructor(user, text, subject) {
    this.to = user.email;
    this.text = text;
    this.from = process.env.SEND_EMAIL_ACCOUNT;
    this.subject = subject;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.USER_EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
      },
    });
  }

  async send() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: this.text,
    };

    await this.newTransport().sendMail(mailOptions);
  }
};

// const sendEmail = async options => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.USER_EMAIL_HOST,
//         port: process.env.EMAIL_PORT,

//         auth: {
//             user: process.env.USER_EMAIL,
//             pass: process.env.USER_EMAIL_PASSWORD
//         }
//     })

//     const mailOptions = {
//         from: 'caesar <theberserkera50@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.text
//     }
//     await transporter.sendMail(mailOptions)
// }

// module.exports = sendEmail
