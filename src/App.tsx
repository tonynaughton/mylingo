import { Container, Flex, Heading, Link, VStack, Text } from "@chakra-ui/react";
import Login from "./components/login";
import { useState } from "react";
import Register from "./components/register";

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);

  return (
    <Container maxW="container.sm">
      <Flex h="100vh" py={20}>
        <VStack w="full" spacing={3}>
          <Heading>Welcome to mylingo</Heading>
          <Text>Please login or register to continue</Text>
          <VStack w="full" h="full" p={10} spacing={10} alignItems="center">
            {showLoginForm ? <Login /> : <Register />}
            <Link onClick={() => setShowLoginForm(!showLoginForm)}>
              {showLoginForm
                ? "Don't have an account? Click here to register."
                : "Already have an account? Click here to login."}
            </Link>
          </VStack>
        </VStack>
      </Flex>
    </Container>
  );
}
