import {
  Container,
  VStack,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorMode
} from "@chakra-ui/react";

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW="container.sm">
      <Flex h="100vh" py={20}>
        <VStack w="full" h="full" p={10} spacing={10} alignItems="center">
          <VStack w="full" spacing={3}>
            <Heading>Welcome to mylingo</Heading>
            <Text>Please login to continue</Text>
          </VStack>
          <VStack w="full" spacing={5}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email"></Input>
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password"></Input>
            </FormControl>
            <Button w="full" size="lg">
              Login
            </Button>
          </VStack>
          <Button onClick={toggleColorMode}>{colorMode === "light" ? "Dark" : "Light"} mode</Button>
        </VStack>
      </Flex>
    </Container>
  );
}
