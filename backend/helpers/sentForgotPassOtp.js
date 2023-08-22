import nodemailer from 'nodemailer'

export default function sentForgotPassOtp(email, otp) {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        })

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Wanderplan password reset',
            html: `
              <h1>Reset Password</h1>
                <h3>use this code in Wanderplan to reset your password</h3>
                <h2>${otp}</h2>
                <h5>this code will expire in 3 minutes</h5>
              `,
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('error', error, info)
                reject(error)
            } else {
                console.log('success')
                resolve({ success: true, message: 'Email sent successfull' })
            }
        })
    })
}