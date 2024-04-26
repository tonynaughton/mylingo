import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

export default function Login(): JSX.Element {
  return (
    <VStack w="full" spacing={3}>
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
  );
}
