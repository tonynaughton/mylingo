import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Register(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const onRegisterClick = async (): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  return (
    <VStack w="full" spacing={3}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
      </FormControl>
      <FormControl>
        <FormLabel>Repeat Password</FormLabel>
        <Input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}></Input>
      </FormControl>
      <Button w="full" size="lg" onClick={onRegisterClick}>
        Register
      </Button>
    </VStack>
  );
}
