// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { botResponses } from '../constants/botResponses';
import { categories } from '../constants/categories';
import { Typing } from './Typing';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    const userInput = e.target.value.toLowerCase();
  
    const filtered = categories.reduce((acc, category) => {
      const filteredCategory = {
        ...category,
        recommendations: category.recommendations.filter((recommendation) =>
          recommendation.toLowerCase().includes(userInput)
        ),
      };
  
      if (filteredCategory.recommendations.length > 0) {
        acc.push(filteredCategory);
      }
  
      return acc;
    }, []);
  
    setFilteredRecommendations(filtered);
    setInput(e.target.value);
  
    if (userInput === '') {
      setFilteredRecommendations([]);
      setSelectedCategory([]);
    } else if (filtered.length > 0) {
      const selectedCategoryNames = filtered.map((item) => item.name);
      setSelectedCategory(selectedCategoryNames);
    }  
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
  
    const userMessage = input.trim();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userMessage, type: 'user' },
    ]);
    setInput('');
  
    handleBotTyping();

    setTimeout(() => {
      handleSpecificResponses(userMessage);
      setIsBotTyping(false);
    }, 1000);
  };  

  const handleBotTyping = () => {
    setIsBotTyping(true);
  };

  const handleSpecificResponses = (userMessage) => {
    let response = '';
  
    for (const entry of botResponses) {
      if (entry.input.some(trigger => userMessage.toLowerCase().includes(trigger))) {
        response = entry.response;
        break;
      }
    }
  
    if (!response) {
      response = 'I did not understand your question. How may I assist you?';
    }
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: <Typing />, type: 'bot' }, 
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove the "typing..." indicator
        { text: response, type: 'bot' },
      ]);
    }, 500);
  };

  const handleRecommendationClick = (recommendation) => {
    if (recommendation.trim() === '') {
      return;
    } 
    
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: recommendation, type: 'user' },
    ]);
    handleBotTyping();

    setTimeout(() => {
      handleSpecificResponses(recommendation);
      setIsBotTyping(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Chatbot</h1>
      </div>
      <div className="chat-container bg-gray-100 p-4 rounded-lg">
        <div className="chat-messages mb-4 max-h-60 overflow-y-auto" ref={messageContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-800'
                } p-2 mb-2 rounded-lg inline-block`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input flex items-center">
          <input
            type="text"
            className="w-full border rounded-md py-2 px-3 outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
          />
          <button
            className="bg-blue-500 text-white py-2 px-4 ml-2 rounded-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <div className="recommendations mt-4">
        {filteredRecommendations.map((category, index) => (
          <div key={index}>
            <button
              className={`${
                selectedCategory.includes(category.name)
                  ? 'bg-gray-400 text-white'
                  : 'bg-gray-300 text-gray-800'
              } py-1 px-4 rounded-lg m-1 text-left w-full`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
            {selectedCategory.includes(category.name) && (
              <div className="pl-4">
                {category.recommendations.map((recommendation, index) => (
                  <button
                    key={index}
                    className="bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded-lg my-1 text-gray-800 w-full text-left"
                    onClick={() => handleRecommendationClick(recommendation)}
                  >
                    {recommendation}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
