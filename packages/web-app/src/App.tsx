import { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Input,
  Button,
  Text,
  Container,
  useToast,
} from '@chakra-ui/react';
import { getChatAnswer } from './api';

// Define the structure for chat messages
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  // State management for URL input, messages, and loading states
  const [url, setUrl] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Handle URL submission and initial webpage loading
  const handleUrlSubmit = async () => {
    if (!url) {
      toast({
        title: 'Error',
        description: 'Please enter a URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement URL processing and initial chat setup
      // Currently using a placeholder response
      setMessages([{
        role: 'assistant',
        content: 'I\'ve loaded the webpage. What would you like to know about it?'
      }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process the URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat message submission and response
  const handleMessageSubmit = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      setIsLoading(true);
      // Use the loaded page content as context. For now, you can use the URL or a placeholder.
      const context = url;
      const response = await getChatAnswer(context, inputMessage);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.in_scope
            ? response.answer
            : "Sorry, that question is outside the scope of this page.",
        },
      ]);
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

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          {/* URL Input Section */}
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Chat with Webpage
            </Text>
            <Box display="flex" gap={2}>
              <Input
                placeholder="Enter webpage URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={messages.length > 0}
              />
              <Button
                colorScheme="blue"
                onClick={handleUrlSubmit}
                isLoading={isLoading}
                disabled={messages.length > 0}
              >
                Load
              </Button>
            </Box>
          </Box>

          {/* Chat Messages Display */}
          {messages.length > 0 && (
            <Box
              borderWidth={1}
              borderRadius="md"
              p={4}
              height="400px"
              overflowY="auto"
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
          )}

          {/* Chat Input Section */}
          {messages.length > 0 && (
            <Box display="flex" gap={2}>
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleMessageSubmit()}
                disabled={isLoading}
              />
              <Button
                colorScheme="blue"
                onClick={handleMessageSubmit}
                isLoading={isLoading}
              >
                Send
              </Button>
            </Box>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App; 