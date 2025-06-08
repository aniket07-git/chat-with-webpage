import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  useColorMode,
  useColorModeValue,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
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
  const [pageContent, setPageContent] = useState('');
  const [tabUrl, setTabUrl] = useState('');
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Color tokens for light/dark mode
  const bg = useColorModeValue('gray.50', 'gray.800');
  const chatBg = useColorModeValue('white', 'gray.700');
  const border = useColorModeValue('gray.200', 'gray.600');
  const userBubble = useColorModeValue('blue.100', 'blue.400');
  const assistantBubble = useColorModeValue('gray.200', 'gray.600');
  const userText = useColorModeValue('blue.800', 'white');
  const assistantText = useColorModeValue('gray.800', 'gray.100');

  // Helper to get active tab's content and URL
  const fetchActiveTabContent = async () => {
    return new Promise<{ content: string; url: string }>((resolve, reject) => {
      if (!chrome.tabs) return reject('Not running in Chrome extension context');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.id) return reject('No active tab');
        const url = tab.url || '';
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'GET_PAGE_CONTENT' },
          (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            } else {
              resolve({ content: response?.content || '', url });
            }
          }
        );
      });
    });
  };

  useEffect(() => {
    // On popup open, get the active tab's content and URL, then load chat/suggestions
    const loadInitialState = async () => {
      try {
        const { content, url } = await fetchActiveTabContent();
        setPageContent(content);
        setTabUrl(url);
        // Load chat history for this URL
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
        // Fetch suggested questions using the page content
        const result = await getSuggestedQuestions(content);
        setSuggestedQuestions(result.suggestions || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load page content',
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
    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
    };
    const updatedUser: Message[] = [...messages, newMessage];
    saveChatHistory(tabUrl, updatedUser);
    setMessages(updatedUser);
    setInputMessage('');
    try {
      setIsLoading(true);
      // Use the loaded page content as context
      const response = await getChatAnswer(pageContent, inputMessage);
      const updatedAssistant: Message[] = [
        ...updatedUser,
        {
          role: 'assistant',
          content: response.in_scope
            ? response.answer
            : 'Sorry, that question is outside the scope of this page.',
        },
      ];
      saveChatHistory(tabUrl, updatedAssistant);
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
    clearChatHistory(tabUrl);
    setMessages([
      {
        role: 'assistant',
        content: "I've loaded the webpage. What would you like to know about it?",
      },
    ]);
  };

  return (
    <Box w="400px" h="600px" p={0} bg={bg} borderRadius="lg" boxShadow="lg" overflow="hidden">
      <VStack h="full" spacing={0} align="stretch">
        {/* Header with theme toggle */}
        <HStack justify="space-between" px={4} py={3} bg={chatBg} borderBottomWidth={1} borderColor={border}>
          <Text fontSize="xl" fontWeight="bold">Chat with Webpage</Text>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </HStack>

        {/* Suggested Questions */}
        {suggestedQuestions.length > 0 && (
          <Box px={4} py={2} bg={chatBg} borderBottomWidth={1} borderColor={border}>
            <Text fontWeight="bold" mb={2}>Suggested Questions:</Text>
            <VStack spacing={1} align="stretch">
              {suggestedQuestions.slice(0, 3).map((q, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputMessage(q)}
                  colorScheme="blue"
                  width="100%"
                  px={3}
                  py={1.5}
                  sx={{
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    textAlign: 'left',
                    lineHeight: 1.4,
                    fontWeight: 500,
                    fontSize: '14px',
                    color: useColorModeValue('blue.700', 'blue.200'),
                    background: 'none',
                    border: 'none',
                    borderRadius: 0,
                    boxShadow: 'none',
                    margin: '2px 0',
                    transition: 'all 0.2s',
                    _hover: {
                      textDecoration: 'underline',
                      color: useColorModeValue('blue.800', 'white'),
                    },
                  }}
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
          bg={chatBg}
          px={4}
          py={2}
          borderBottomWidth={1}
          borderColor={border}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              mb={3}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="80%"
              bg={message.role === 'user' ? userBubble : assistantBubble}
              color={message.role === 'user' ? userText : assistantText}
              px={4}
              py={2}
              borderRadius={message.role === 'user' ? 'xl' : 'lg'}
              boxShadow="sm"
            >
              <Text fontWeight="bold" fontSize="sm" mb={1}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </Text>
              <Text fontSize="md" whiteSpace="pre-wrap">{message.content}</Text>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box w="full" px={4} py={3} bg={chatBg}>
          <HStack spacing={2}>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleMessageSubmit()}
              disabled={isLoading}
              bg={useColorModeValue('white', 'gray.800')}
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
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Popup; 