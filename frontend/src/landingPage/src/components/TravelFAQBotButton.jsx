import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What documents do I need for international travel?",
    answer: "For international travel, you typically need a valid passport. Depending on your destination, you may also need a visa. It's best to check the specific requirements for your destination country well in advance of your trip."
  },
  {
    question: "How early should I arrive at the airport for my flight?",
    answer: "For domestic flights, it's recommended to arrive at least 2 hours before your scheduled departure time. For international flights, arrive at least 3 hours early. This allows time for check-in, security screening, and any unexpected delays."
  },
  {
    question: "What are the baggage allowance limits?",
    answer: "Baggage allowances vary by airline and ticket class. Generally, economy class allows one carry-on bag and one personal item. Checked baggage limits typically range from 20-30kg (44-66lbs). Always check with your specific airline for their policy."
  },
  {
    question: "How can I get the best deals on flights and hotels?",
    answer: "To get the best deals, book in advance, be flexible with your travel dates, use comparison websites, sign up for airline and hotel newsletters, and consider package deals. Traveling during off-peak seasons can also lead to significant savings."
  },
  {
    question: "What should I do if I lose my passport while traveling?",
    answer: "If you lose your passport while traveling, immediately contact your country's nearest embassy or consulate. They can help you get a replacement passport. It's also a good idea to have a photocopy of your passport stored separately or digitally, which can speed up the replacement process."
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
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center transition-all duration-300 ease-in-out"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <>
            <ChevronDown className="w-5 h-5 mr-2" />
            Close FAQ Bot
          </>
        ) : (
          <>
            <ChevronUp className="w-5 h-5 mr-2" />
            Open FAQ Bot
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
      )}
    </div>
  );
};

export default TravelFAQBotButton;
