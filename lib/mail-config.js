import nodemailer from "nodemailer";

const profiles = {
  feedback: {
    name: "Feedback | Raksha Bandhan",
    auth: {
      user: process.env.FEEDBACK_EMAIL,
      pass: process.env.FEEDBACK_PASSWORD,
    },
  },
};

export default function GetMailConfig(type) {
  return {
    name: `${profiles[type].auth.user} ${profiles[type].name}`,
    transport: nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: profiles[type].auth,
    }),
  };
}
