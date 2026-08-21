"use server";

import GetMailConfig from "@/lib/mail-config";

const TO_EMAIL = process.env.FEEDBACK_TO || process.env.FEEDBACK_EMAIL;

export async function sendFeedback(prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !description) {
    return { message: "error", error: "Please fill in both fields." };
  }
  if (name.length > 100 || description.length > 2000) {
    return { message: "error", error: "That's a bit too long." };
  }

  const { name: from, transport } = GetMailConfig("feedback");
  const safeName = name.replace(/[\r\n]+/g, " "); // avoid header injection in subject

  try {
    await transport.sendMail({
      from,
      to: TO_EMAIL,
      subject: `Raksha Bandhan Feedback`,
      text: `Name: ${safeName}\n\nDescription:\n${description}`,
    });
    return { message: "success" };
  } catch (error) {
    console.error("Feedback mail failed:", error);
    return { message: "error", error: "Could not send. Please try again." };
  }
}
