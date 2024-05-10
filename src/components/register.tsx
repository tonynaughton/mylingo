import { VStack, FormControl, FormLabel, Input, Button, FormErrorMessage } from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";

import { auth } from "../firebase";

interface FormInput {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function Register(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  const onRegister = async (data: FormInput): Promise<void> => {
    const { email, password } = data;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("Error registering: " + err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onRegister)} style={{ width: "100%" }}>
      <VStack w="full" spacing={3}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            {...register("name", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" }
            })}
          />
        </FormControl>
        <FormErrorMessage>{errors.name ? errors.name.message : ""}</FormErrorMessage>
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
        <FormControl isInvalid={!!errors.repeatPassword}>
          <FormLabel htmlFor="repeat-password">Repeat Password</FormLabel>
          <Input
            autoComplete="repeat-password"
            type="password"
            {...register("repeatPassword", { required: "This is required" })}
          />
        </FormControl>
        <FormErrorMessage>{errors.repeatPassword ? errors.repeatPassword.message : ""}</FormErrorMessage>
        <Button w="full" size="lg" isLoading={isSubmitting} type="submit">
          Register
        </Button>
      </VStack>
    </form>
  );
}
