import { Container, Flex } from "@chakra-ui/react";
import { AppBar } from "../components/app_bar";

export function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <Container maxW="md">
      <Flex h="100vh" flexDirection="column" justifyContent="center" alignItems="center">
        <AppBar />
        <Flex width="full" flex="1" flexDirection="column" justifyContent="center" alignItems="center">
          {children}
        </Flex>
      </Flex>
    </Container>
  );
}
