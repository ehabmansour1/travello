import emailjs from "@emailjs/browser";

// EmailJS configuration
export const EMAIL_CONFIG = {
  serviceId: "service_sot09a6", // Replace with your EmailJS service ID
  templateId: "template_beouyvb", // Replace with your EmailJS template ID
  publicKey: "Fq0Wor31ChY9C7iD_", // Replace with your EmailJS public key
  recipientEmail: "mansehab990@gmail.com", // The email address to receive contact form submissions
};

// Function to send email using EmailJS
export const sendEmail = (formRef) => {
  return emailjs.sendForm(
    EMAIL_CONFIG.serviceId,
    EMAIL_CONFIG.templateId,
    formRef.current,
    EMAIL_CONFIG.publicKey
  );
};
