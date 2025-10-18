import { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ERCO AI assistant. I can help you find the perfect solar solution. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What size solar system do I need?',
    'How much do solar panels cost?',
    'What\'s the difference between on-grid and off-grid?',
    'How long does installation take?',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setInput('');
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('size') || lowerQuestion.includes('how much')) {
      return 'To determine the right solar system size, I need to know:\n\n1. Your monthly electricity consumption (in kWh)\n2. Your location and average sunlight hours\n3. Your budget range\n\nWould you like to take our AI recommendation quiz? It will help me give you personalized suggestions!';
    }

    if (lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
      return 'Solar system costs vary based on:\n\n• System size (typically $2,000 - $15,000)\n• Quality and brand of components\n• Installation complexity\n• Location\n\nOn our marketplace, you can compare prices from multiple vendors to get the best deal. Would you like me to show you some options?';
    }

    if (lowerQuestion.includes('grid') || lowerQuestion.includes('off-grid')) {
      return 'Great question!\n\n**On-Grid Systems:**\n• Connected to utility grid\n• Lower cost (no batteries needed)\n• Excess energy sold back to grid\n\n**Off-Grid Systems:**\n• Complete independence\n• Requires battery storage\n• Higher initial cost\n• Perfect for remote areas\n\nWhich type interests you more?';
    }

    if (lowerQuestion.includes('installation') || lowerQuestion.includes('install')) {
      return 'Solar installation typically takes:\n\n• 1-3 days for residential systems\n• 1-2 weeks for commercial systems\n\nThe process includes:\n1. Site assessment\n2. Mounting panel installation\n3. Electrical connections\n4. System testing\n\nOur verified vendors can provide detailed timelines for your specific project!';
    }

    return 'That\'s a great question! I can help you with:\n\n• Solar system sizing\n• Product recommendations\n• Price comparisons\n• Technical specifications\n• Installation guidance\n\nCould you provide more details about what you\'re looking for?';
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
      >
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[600px] max-h-[calc(100vh-3rem)]">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Sparkles className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">ERCO AI Assistant</h3>
            <p className="text-xs text-gray-700">Always here to help</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="block w-full text-left text-sm p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
          />
          <Button onClick={handleSend} className="px-4">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
