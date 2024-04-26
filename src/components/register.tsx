import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

export default function Register(): JSX.Element {
  return (
    <VStack w="full" spacing={3}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email"></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password"></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Repeat Password</FormLabel>
        <Input type="password"></Input>
      </FormControl>
      <Button w="full" size="lg">
        Register
      </Button>
    </VStack>
  );
}
