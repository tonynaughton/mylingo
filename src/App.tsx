import { ChakraProvider } from "@chakra-ui/react";

import Home from "./pages/home";

export default function App() {
  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
}
