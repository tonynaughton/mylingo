import { useEffect, useState } from "react";
import { Container, Flex, Heading, Link, VStack, Text, Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";

import Login from "./components/login";
import Register from "./components/register";
import { auth } from "./firebase";

export default function App() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  function renderAuthForm(): JSX.Element {
    return (
      <VStack w="full" spacing={3}>
        <Heading>Welcome to mylingo</Heading>
        <Text>Please login or register to continue</Text>
        <VStack w="full" h="full" p={10} spacing={5} alignItems="center">
          {showLoginForm ? <Login /> : <Register />}
          <Link onClick={() => setShowLoginForm(!showLoginForm)}>
            {showLoginForm
              ? "Don't have an account? Click here to register."
              : "Already have an account? Click here to login."}
          </Link>
        </VStack>
      </VStack>
    );
  }

  return (
    <Container maxW="container.sm">
      <Flex h="100vh" py={20}>
        {currentUser ? <Button onClick={() => signOut(auth)}>Logout</Button> : renderAuthForm()}
      </Flex>
    </Container>
  );
}
