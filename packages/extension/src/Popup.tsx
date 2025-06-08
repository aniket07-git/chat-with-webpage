import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { getChatAnswer, getSuggestedQuestions } from './api';
import { saveChatHistory, loadChatHistory, clearChatHistory } from './chatHistory';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Popup: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    // Load chat history and suggested questions when popup opens
    const loadInitialState = async () => {
      try {
        const url = window.location.href;
        const history = loadChatHistory(url);
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              role: 'assistant',
              content: "I've loaded the webpage. What would you like to know about it?",
            },
          ]);
        }
        // Fetch suggested questions
        const result = await getSuggestedQuestions(url);
        setSuggestedQuestions(result.suggestions || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load chat history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadInitialState();
  }, []);

  const handleMessageSubmit = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const url = window.location.href;
    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    const updatedUser: Message[] = [...messages, newMessage];
    saveChatHistory(url, updatedUser);
    setMessages(updatedUser);
    setInputMessage('');

    try {
      setIsLoading(true);
      const response = await getChatAnswer(url, inputMessage);
      const updatedAssistant: Message[] = [
        ...updatedUser,
        {
          role: 'assistant',
          content: response.in_scope
            ? response.answer
            : 'Sorry, that question is outside the scope of this page.',
        },
      ];
      saveChatHistory(url, updatedAssistant);
      setMessages(updatedAssistant);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const url = window.location.href;
    clearChatHistory(url);
    setMessages([
      {
        role: 'assistant',
        content: "I've loaded the webpage. What would you like to know about it?",
      },
    ]);
  };

  return (
    <Box w="400px" h="600px" p={4}>
      <VStack h="full" spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Chat with Webpage</Text>
        
        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && (
          <Box w="full">
            <Text fontWeight="bold" mb={2}>Suggested Questions:</Text>
            <VStack align="start">
              {suggestedQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(q)}
                >
                  {q}
                </Button>
              ))}
            </VStack>
          </Box>
        )}

        {/* Chat Messages */}
        <Box 
          flex={1} 
          w="full" 
          overflowY="auto" 
          borderWidth={1} 
          borderRadius="md" 
          p={4}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              mb={4}
              p={3}
              borderRadius="md"
              bg={message.role === 'user' ? 'blue.50' : 'gray.50'}
            >
              <Text fontWeight="bold" mb={1}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </Text>
              <Text>{message.content}</Text>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box w="full" display="flex" gap={2}>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleMessageSubmit()}
            disabled={isLoading}
          />
          <Button 
            colorScheme="blue" 
            onClick={handleMessageSubmit}
            isLoading={isLoading}
            disabled={!inputMessage.trim()}
          >
            Send
          </Button>
          {messages.length > 0 && (
            <Button 
              colorScheme="red" 
              variant="outline" 
              onClick={handleClearHistory}
            >
              Clear
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Popup; 