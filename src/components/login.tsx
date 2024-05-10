import { VStack, FormControl, FormLabel, Input, Button, FormErrorMessage } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

interface FormInput {
  email: string;
  password: string;
}

export default function Login(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  const onLogin = async (data: FormInput): Promise<void> => {
    const { email, password } = data;
    await signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <form onSubmit={handleSubmit(onLogin)} style={{ width: "100%" }}>
      <VStack w="full" spacing={3}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            autoComplete="email"
            id="email"
            type="email"
            {...register("email", { required: "This is required" })}
          />
        </FormControl>
        <FormErrorMessage>{errors.email ? errors.email.message : ""}</FormErrorMessage>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input autoComplete="password" type="password" {...register("password", { required: "This is required" })} />
        </FormControl>
        <FormErrorMessage>{errors.password ? errors.password.message : ""}</FormErrorMessage>
        <Button w="full" size="lg" isLoading={isSubmitting} type="submit">
          Login
        </Button>
      </VStack>
    </form>
  );
}
