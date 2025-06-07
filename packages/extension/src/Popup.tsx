import { useState, useEffect } from 'react';
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function Popup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Get the current page content when popup opens
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.sendMessage(
          activeTab.id,
          { type: 'GET_PAGE_CONTENT' },
          (response) => {
            if (response?.content) {
              setMessages([{
                role: 'assistant',
                content: 'I\'ve loaded the webpage content. What would you like to know about it?'
              }]);
            }
          }
        );
      }
    });
  }, []);

  const handleMessageSubmit = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      setIsLoading(true);
      // TODO: Implement chat message processing with OpenAI
      const response: Message = {
        role: 'assistant',
        content: 'This is a placeholder response. Chat functionality will be implemented soon.',
      };
      setMessages(prev => [...prev, response]);
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
      <Container maxW="container.sm" py={4}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="xl" fontWeight="bold">
            Chat with Webpage
          </Text>

          {messages.length > 0 && (
            <Box
              borderWidth={1}
              borderRadius="md"
              p={4}
              height="300px"
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
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default Popup; 