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
  useColorMode,
  useColorModeValue,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { getChatAnswer } from './api';
import { saveChatHistory, loadChatHistory, clearChatHistory, getSuggestedQuestions } from './chatHistory';

// Define animations
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

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
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
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
  const gradientStart = useColorModeValue('blue.50', 'blue.900');
  const gradientEnd = useColorModeValue('purple.50', 'purple.900');

  // Animation styles
  const gradientAnimation = {
    background: `linear-gradient(-45deg, ${gradientStart}, ${gradientEnd}, ${gradientStart})`,
    backgroundSize: '400% 400%',
    animation: `${gradientShift} 15s ease infinite`,
  };

  const floatingAnimation = {
    animation: `${float} 6s ease-in-out infinite`,
  };

  const pulseAnimation = {
    animation: `${pulse} 3s ease-in-out infinite`,
  };

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
      // Load chat history for this URL
      const history = loadChatHistory(url);
      if (history.length > 0) {
        setMessages(history);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: "I've loaded the webpage. What would you like to know about it?",
          } as Message,
        ]);
      }
      // Fetch suggested questions
      const context = url; // Replace with actual page content if available
      const result = await getSuggestedQuestions(context);
      setSuggestedQuestions(result.suggestions || []);
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

    const updatedUser: Message[] = [...messages, newMessage];
    saveChatHistory(url, updatedUser);
    setMessages(updatedUser);
    setInputMessage('');

    try {
      setIsLoading(true);
      // Use the loaded page content as context. For now, you can use the URL or a placeholder.
      const context = url;
      const response = await getChatAnswer(context, inputMessage);
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

  // Clear chat history for the current URL
  const handleClearHistory = () => {
    clearChatHistory(url);
    setMessages([
      {
        role: 'assistant',
        content: "I've loaded the webpage. What would you like to know about it?",
      } as Message,
    ]);
  };

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        position="relative"
        overflow="hidden"
        sx={gradientAnimation}
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          w="200px"
          h="200px"
          borderRadius="full"
          bg={useColorModeValue('blue.200', 'blue.800')}
          opacity={useColorModeValue(0.35, 0.18)}
          sx={floatingAnimation}
        />
        <Box
          position="absolute"
          bottom="20%"
          right="15%"
          w="300px"
          h="300px"
          borderRadius="full"
          bg={useColorModeValue('purple.200', 'purple.800')}
          opacity={useColorModeValue(0.32, 0.15)}
          sx={floatingAnimation}
        />
        <Box
          position="absolute"
          top="40%"
          right="30%"
          w="150px"
          h="150px"
          borderRadius="full"
          bg={useColorModeValue('teal.200', 'teal.800')}
          opacity={useColorModeValue(0.32, 0.15)}
          sx={pulseAnimation}
        />
        <Box position="absolute" bottom="6%" right="7%" zIndex={0} opacity={useColorModeValue(0.38, 0.15)} pointerEvents="none">
          <svg width="90" height="60" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Person 1 */}
            <circle cx="20" cy="20" r="8" stroke={useColorModeValue('#2D3748', '#F6E05E')} strokeWidth="3.5" fill="none"/>
            <line x1="20" y1="28" x2="20" y2="48" stroke={useColorModeValue('#2D3748', '#F6E05E')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="20" y1="35" x2="10" y2="45" stroke={useColorModeValue('#2D3748', '#F6E05E')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="20" y1="35" x2="30" y2="45" stroke={useColorModeValue('#2D3748', '#F6E05E')} strokeWidth="3.5" strokeLinecap="round"/>
            {/* Person 2 */}
            <circle cx="45" cy="18" r="7" stroke={useColorModeValue('#2B6CB0', '#B794F4')} strokeWidth="3.5" fill="none"/>
            <line x1="45" y1="25" x2="45" y2="45" stroke={useColorModeValue('#2B6CB0', '#B794F4')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="45" y1="32" x2="38" y2="42" stroke={useColorModeValue('#2B6CB0', '#B794F4')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="45" y1="32" x2="52" y2="42" stroke={useColorModeValue('#2B6CB0', '#B794F4')} strokeWidth="3.5" strokeLinecap="round"/>
            {/* Person 3 */}
            <circle cx="70" cy="23" r="6" stroke={useColorModeValue('#276749', '#F687B3')} strokeWidth="3.5" fill="none"/>
            <line x1="70" y1="29" x2="70" y2="47" stroke={useColorModeValue('#276749', '#F687B3')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="70" y1="35" x2="63" y2="45" stroke={useColorModeValue('#276749', '#F687B3')} strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="70" y1="35" x2="77" y2="45" stroke={useColorModeValue('#276749', '#F687B3')} strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </Box>
        {/* Minimalistic doodle SVGs */}
        <Box position="absolute" top="8%" left="55%" zIndex={0} opacity={useColorModeValue(0.38, 0.18)} pointerEvents="none">
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 Q 60 10 110 50" stroke={useColorModeValue('#4A5568', '#4FD1C5')} strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
        </Box>
        <Box position="absolute" bottom="10%" left="20%" zIndex={0} opacity={useColorModeValue(0.33, 0.13)} pointerEvents="none">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke={useColorModeValue('#6B46C1', '#63B3ED')} strokeWidth="4.5" fill="none"/>
          </svg>
        </Box>
        <Box position="absolute" top="60%" right="10%" zIndex={0} opacity={useColorModeValue(0.32, 0.12)} pointerEvents="none">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="35,10 60,60 10,60" stroke={useColorModeValue('#2F855A', '#F6E05E')} strokeWidth="4" fill="none"/>
          </svg>
        </Box>

        <Container maxW="container.md" py={8} position="relative" zIndex="1">
          <VStack spacing={6} align="stretch">
            {/* Header with theme toggle */}
            <HStack 
              justify="space-between" 
              px={4} 
              py={3} 
              bg={chatBg} 
              borderRadius="lg" 
              boxShadow="md"
              backdropFilter="blur(10px)"
              sx={{
                transition: 'all 0.3s ease',
                _hover: {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                },
              }}
            >
              <Text fontSize="2xl" fontWeight="bold">Chat with Webpage</Text>
              <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                sx={{
                  transition: 'all 0.3s ease',
                  bg: useColorModeValue('whiteAlpha.900', 'gray.700'),
                  color: useColorModeValue('gray.700', 'yellow.300'),
                  border: '1px solid',
                  borderColor: useColorModeValue('gray.200', 'gray.600'),
                  boxShadow: 'sm',
                  _hover: {
                    transform: 'rotate(180deg)',
                    bg: useColorModeValue('gray.100', 'gray.600'),
                    boxShadow: 'md',
                  },
                }}
              />
            </HStack>

            {/* URL Input Section */}
            <Box 
              bg={chatBg} 
              p={4} 
              borderRadius="lg" 
              boxShadow="md"
              backdropFilter="blur(10px)"
              sx={{
                transition: 'all 0.3s ease',
                _hover: {
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                },
              }}
            >
              <HStack spacing={2}>
                <Input
                  placeholder="Enter webpage URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={messages.length > 0}
                  bg={useColorModeValue('white', 'gray.800')}
                  sx={{
                    transition: 'all 0.3s ease',
                    _focus: {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleUrlSubmit}
                  isLoading={isLoading}
                  disabled={messages.length > 0}
                  sx={{
                    transition: 'all 0.3s ease',
                    bg: useColorModeValue('blue.500', 'blue.400'),
                    color: 'white',
                    border: '1px solid',
                    borderColor: useColorModeValue('blue.400', 'blue.600'),
                    boxShadow: 'sm',
                    _hover: {
                      transform: 'translateY(-2px)',
                      bg: useColorModeValue('blue.600', 'blue.300'),
                      boxShadow: 'md',
                    },
                    _active: {
                      bg: useColorModeValue('blue.700', 'blue.200'),
                    },
                  }}
                >
                  Load
                </Button>
                {messages.length > 0 && (
                  <Button 
                    colorScheme="red" 
                    variant="outline" 
                    onClick={handleClearHistory}
                    sx={{
                      transition: 'all 0.3s ease',
                      bg: useColorModeValue('whiteAlpha.900', 'gray.700'),
                      color: useColorModeValue('red.600', 'red.200'),
                      border: '1px solid',
                      borderColor: useColorModeValue('red.200', 'red.600'),
                      boxShadow: 'sm',
                      _hover: {
                        transform: 'translateY(-2px)',
                        bg: useColorModeValue('red.50', 'red.800'),
                        color: useColorModeValue('red.700', 'red.100'),
                        boxShadow: 'md',
                      },
                      _active: {
                        bg: useColorModeValue('red.100', 'red.900'),
                      },
                    }}
                  >
                    Clear History
                  </Button>
                )}
              </HStack>
            </Box>

            {/* Suggested Questions Display */}
            {suggestedQuestions.length > 0 && (
              <Box 
                bg={chatBg} 
                p={4} 
                borderRadius="lg" 
                boxShadow="md"
                backdropFilter="blur(10px)"
                sx={{
                  transition: 'all 0.3s ease',
                  _hover: {
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  },
                }}
              >
                <Text fontWeight="bold" mb={2}>Suggested Questions:</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {suggestedQuestions.map((q, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(q)}
                      colorScheme="blue"
                      sx={{
                        transition: 'all 0.3s ease',
                        bg: useColorModeValue('whiteAlpha.900', 'gray.700'),
                        color: useColorModeValue('blue.700', 'blue.200'),
                        border: '1px solid',
                        borderColor: useColorModeValue('blue.200', 'blue.600'),
                        boxShadow: 'sm',
                        _hover: {
                          transform: 'translateY(-2px)',
                          bg: useColorModeValue('blue.50', 'blue.800'),
                          color: useColorModeValue('blue.800', 'blue.100'),
                          boxShadow: 'md',
                        },
                        _active: {
                          bg: useColorModeValue('blue.100', 'blue.900'),
                        },
                      }}
                    >
                      {q}
                    </Button>
                  ))}
                </HStack>
              </Box>
            )}

            {/* Chat Messages Display */}
            {messages.length > 0 && (
              <Box
                bg={chatBg}
                p={4}
                borderRadius="lg"
                height="400px"
                overflowY="auto"
                boxShadow="md"
                backdropFilter="blur(10px)"
                sx={{
                  transition: 'all 0.3s ease',
                  _hover: {
                    boxShadow: 'lg',
                  },
                }}
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
                    sx={{
                      transition: 'all 0.3s ease',
                      _hover: {
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                      },
                    }}
                  >
                    <Text fontWeight="bold" fontSize="sm" mb={1}>
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </Text>
                    <Text fontSize="md" whiteSpace="pre-wrap">{message.content}</Text>
                  </Box>
                ))}
              </Box>
            )}

            {/* Chat Input Section */}
            {messages.length > 0 && (
              <Box 
                bg={chatBg} 
                p={4} 
                borderRadius="lg" 
                boxShadow="md"
                backdropFilter="blur(10px)"
                sx={{
                  transition: 'all 0.3s ease',
                  _hover: {
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  },
                }}
              >
                <HStack spacing={2}>
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleMessageSubmit()}
                    disabled={isLoading}
                    bg={useColorModeValue('white', 'gray.800')}
                    sx={{
                      transition: 'all 0.3s ease',
                      _focus: {
                        transform: 'scale(1.02)',
                      },
                    }}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={handleMessageSubmit}
                    isLoading={isLoading}
                    disabled={!inputMessage.trim()}
                    sx={{
                      transition: 'all 0.3s ease',
                      _hover: {
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Send
                  </Button>
                </HStack>
              </Box>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App; 