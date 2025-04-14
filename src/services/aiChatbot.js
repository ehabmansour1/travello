import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const getAIResponse = async (userMessage) => {
  try {
    // Get all tours from Firestore
    const toursRef = collection(db, "tours");
    const querySnapshot = await getDocs(toursRef);
    const allTours = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Find relevant tours based on keywords
    const relevantTours = allTours.filter((tour) => {
      const keywords = tour.keywords || [];
      const searchTerms = userMessage.toLowerCase().split(" ");
      return keywords.some((keyword) =>
        searchTerms.includes(keyword.toLowerCase())
      );
    });

    // Prepare context from all tours data
    const context = allTours
      .map(
        (tour) =>
          `Tour: ${tour.name}
Description: ${tour.description}
Price: ${tour.price}
Duration: ${tour.duration}
Location: ${tour.location || "Not specified"}
Category: ${tour.category || "Not specified"}
Rating: ${tour.rating || "Not rated"}
Available Dates: ${
            tour.availableDates?.join(", ") || "Contact for availability"
          }`
      )
      .join("\n\n");

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful travel assistant for Travello. Use the following tour information to answer questions. If no specific tours match, provide general travel advice. Always be friendly and professional. If you can't help, suggest speaking with a human support agent.

Available Tours:
${context || "No tours found in the database."}

Remember to:
1. Use the tour information when relevant
2. Be concise and helpful
3. Suggest human support if needed
4. Maintain a friendly tone
5. If asked about specific tours, provide detailed information from the available tours
6. If asked about prices, mention the price ranges available
7. If asked about locations, mention the available destinations`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to get AI response");
    }

    return {
      message: data.choices[0].message.content,
      tours: relevantTours,
    };
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    return {
      message:
        "I'm having trouble processing your request. Would you like to speak with a human support agent?",
      tours: [],
    };
  }
};

export { getAIResponse };
