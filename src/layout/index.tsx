import { VStack, Container, Flex } from "@chakra-ui/react";

export function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <Container maxW="md">
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <VStack w="full" h="fit-content" spacing={3}>
          {children}
        </VStack>
      </Flex>
    </Container>
  );
}
