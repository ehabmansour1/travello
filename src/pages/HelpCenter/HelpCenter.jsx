import React, { useState } from "react";
import styles from "./HelpCenter.module.css";

const HelpCenter = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is included in the tour package?",
      answer:
        "Our tour packages include accommodation, transportation, guided tours, and some meals. Specific inclusions vary by package.",
    },
    {
      question: "Can I customize my travel itinerary?",
      answer:
        "Yes, we offer customizable itineraries for private tours. Contact us for more details.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Cancellations made 30 days before the tour start date are eligible for a full refund. Please refer to our terms and conditions for more details.",
    },
    {
      question: "Are flights included in the tour price?",
      answer:
        "No, flights are not included unless explicitly mentioned in the package details.",
    },
    {
      question: "How do I book a tour?",
      answer:
        "You can book a tour directly on our website or contact our support team for assistance.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles["help-center-container"]}>
      <div className={styles["help-center-header"]}>
        <h1>FAQs & Help Center</h1>
        <p>Find answers to common travel questions below.</p>
      </div>

      <div className={styles["faq-list"]}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`${styles["faq-item"]} ${
              activeIndex === index ? styles["active"] : ""
            }`}
          >
            <div
              className={styles["faq-question"]}
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>
              <span>
                {activeIndex === index ? (
                  <i className="fas fa-chevron-up"></i>
                ) : (
                  <i className="fas fa-chevron-down"></i>
                )}
              </span>
            </div>
            {activeIndex === index && (
              <div className={styles["faq-answer"]}>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;