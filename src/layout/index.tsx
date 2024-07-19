import { Container, Flex } from "@chakra-ui/react";
import { AppBar } from "../components/app_bar";

export function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <Container maxW="md">
      <Flex h="100vh" flexDirection="column" justifyContent="center" alignItems="center" py={5}>
        <AppBar />
        <Flex width="full" flexGrow="1" flexDirection="column" justifyContent="center" alignItems="center" overflow="scroll">
          {children}
        </Flex>
      </Flex>
    </Container>
  );
}
