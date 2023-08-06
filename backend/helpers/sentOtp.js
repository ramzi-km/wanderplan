import nodemailer from 'nodemailer'

export default function sentOTP(email, otp) {
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
            subject: 'Wanderplan Email verification',
            html: `
              <h1>Verify Your Email For Wanderplan</h1>
                <h3>use this code in Wanderplan to verify your email</h3>
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
