import { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import '../landingpage.css';

const faqData = [
  {
    question: "How can I book a trip through Echo Voyage?",
    answer: "To book a trip, log in to your Echo Voyage account, browse available destinations, and select your preferred package. Complete the payment process, and you'll receive a confirmation email with all the details."
  },
  {
    question: "What payment methods does Echo Voyage accept?",
    answer: "Echo Voyage accepts credit cards, debit cards, and popular digital payment methods like PayPal and UPI. All transactions are secure and encrypted for your safety."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking through the 'My Bookings' section on your dashboard. Please note that cancellation or modification policies may vary depending on the package or service provider."
  },
  {
    question: "How do I contact a local guide through Echo Voyage?",
    answer: "After booking a package that includes local guide services, you'll find the guide's contact details in the 'My Bookings' section. You can directly communicate with them for assistance."
  },
  {
    question: "What should I do if I encounter an issue during my trip?",
    answer: "If you face any issues during your trip, contact our 24/7 support team through the 'Help' section on Echo Voyage. We'll ensure your concerns are addressed promptly."
  }
];

const TravelFAQBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedFaq = faqData.find(faq =>
      faq.question.toLowerCase().includes(question.toLowerCase())
    );
    setAnswer(matchedFaq ? matchedFaq.answer : "I'm sorry, I couldn't find an answer to that question. Please try rephrasing or ask another travel-related question.");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-all duration-300 ease-in-out"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <>
            <ChevronDown className="w-5 h-5 mr-2" />
            FAQ
          </>
        ) : (
          <>
            <ChevronUp className="w-5 h-5 mr-2" />
            FAQ
          </>
        )}
      </button>
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-white rounded-lg shadow-xl p-6 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel FAQ Bot</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center border-b border-gray-300 py-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a travel-related question..."
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          {answer && (
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Answer:</h3>
              <p className="text-gray-600">{answer}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Popular Questions:</h3>
            <div className="overflow-y-auto max-h-60">
              <ul className="list-disc pl-5 text-gray-600">
                {faqData.map((faq, index) => (
                  <li key={index} className="mb-1">
                    <button
                      onClick={() => setQuestion(faq.question)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none text-left"
                    >
                      {faq.question}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelFAQBotButton;
