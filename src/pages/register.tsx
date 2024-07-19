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
  Text,
  Select
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../firebase";
import { Layout } from "../layout";
import languages from "../data/languages.json";

export interface RegisterFormInput {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
  nativeCode: string;
  targetCode: string;
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
      toast({ title: "Registration successful", status: "success" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, status: "error" });
    }
  };

  return (
    <Layout>
      <VStack spacing={5} overflowY="auto">
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
                id="password"
              />
            </FormControl>
            <FormErrorMessage>{errors.password ? errors.password.message : ""}</FormErrorMessage>
            <FormControl isInvalid={!!errors.repeatPassword}>
              <FormLabel htmlFor="repeat-password">Repeat Password</FormLabel>
              <Input
                autoComplete="repeat-password"
                type="password"
                {...register("repeatPassword", { required: "This is required" })}
                id="repeat-password"
              />
            </FormControl>
            <FormErrorMessage>{errors.repeatPassword ? errors.repeatPassword.message : ""}</FormErrorMessage>
            <FormControl isInvalid={!!errors.nativeCode}>
              <FormLabel htmlFor="native-language">Native Language</FormLabel>
              <Select {...register("nativeCode", { required: "This is required" })} id="native-language">
                {languages.map((language) => (
                  <option value={language.code}>{language.label}</option>
                ))}
              </Select>
            </FormControl>
            <FormErrorMessage>{errors.nativeCode ? errors.nativeCode.message : ""}</FormErrorMessage>
            <FormControl isInvalid={!!errors.targetCode}>
              <FormLabel htmlFor="target-language">Target Language</FormLabel>
              <Select {...register("targetCode", { required: "This is required" })} id="target-language">
                {languages.map((language) => (
                  <option value={language.code}>{language.label}</option>
                ))}
              </Select>
            </FormControl>
            <FormErrorMessage>{errors.targetCode ? errors.targetCode.message : ""}</FormErrorMessage>
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
