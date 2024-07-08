import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Link,
  Heading,
  Text
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../firebase";
import { Layout } from "../layout";

export interface RegisterFormInput {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export function Register(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInput>();

  const onRegister = async (data: RegisterFormInput): Promise<void> => {
    try {
      await registerUser(data);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true
      });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Layout>
      <VStack spacing={5}>
        <Heading>Welcome</Heading>
        <Text>Please login or register to continue</Text>
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
              <Input
                autoComplete="password"
                type="password"
                {...register("password", { required: "This is required" })}
              />
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
        <Link onClick={() => navigate("/login")}>Already have an account? Click here to login.</Link>
      </VStack>
    </Layout>
  );
}
