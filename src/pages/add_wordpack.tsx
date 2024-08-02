import { useForm } from "react-hook-form";
import { Button, Input, VStack, Heading, FormControl, FormLabel, FormErrorMessage, useToast } from "@chakra-ui/react";

import { Layout } from "../layout";
import { addWordpack } from "../firebase";

export interface AddWordpackInput {
  title: string;
  description?: string;
}

export function AddWordpack(): JSX.Element {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddWordpackInput>();

  const onAddWordpack = async (input: AddWordpackInput): Promise<void> => {
    try {
      await addWordpack(input);
      toast({ title: "Word saved successfully", status: "success" });
      reset();
    } catch (err: any) {
      toast({ title: "Failed to save word", description: err.message, status: "error" });
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onAddWordpack)} style={{ width: "100%" }}>
        <VStack spacing={5} width="full">
          <Heading>Add Wordpack</Heading>
          <FormControl isInvalid={!!errors.title}>
            <FormLabel htmlFor="target-word">Title</FormLabel>
            <Input id="target-word" {...register("title", { required: "Required" })} />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.description}>
            <FormLabel htmlFor="native-word">Description</FormLabel>
            <Input id="native-word" {...register("description")} />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>
          <Button width="full" colorScheme="teal" size="lg" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </VStack>
      </form>
    </Layout>
  );
}
