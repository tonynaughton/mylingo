import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Heading,
  Text,
  Link
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { Layout } from "../layout";

interface FormInput {
  email: string;
  password: string;
}

export default function Login(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  const onLogin = async (data: FormInput): Promise<void> => {
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Layout>
      <>
        <Heading>mylingo</Heading>
        <Text>Please login or register to continue</Text>
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
              <Input
                autoComplete="password"
                type="password"
                {...register("password", { required: "This is required" })}
              />
            </FormControl>
            <FormErrorMessage>{errors.password ? errors.password.message : ""}</FormErrorMessage>
            <Button w="full" size="lg" isLoading={isSubmitting} type="submit">
              Login
            </Button>
          </VStack>
        </form>
        <Link onClick={() => navigate("/register")}>Don't have an account? Click here to register.</Link>
      </>
    </Layout>
  );
}
