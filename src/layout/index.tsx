import { Container, Flex } from "@chakra-ui/react";
import { AppBar } from "../components/app_bar";

export function Layout({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <Container maxW="lg" h="100dvh">
      <AppBar />
      <Flex h="100%" flexDirection="column" justifyContent="center" alignItems="center">
        <Flex
          py={5}
          width="full"
          flexGrow="1"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          overflow="auto"
        >
          {children}
        </Flex>
      </Flex>
    </Container>
  );
}
