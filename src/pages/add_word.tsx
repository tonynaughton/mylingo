import { useForm } from "react-hook-form";
import { Button, Input, VStack, Heading, FormControl, FormLabel, FormErrorMessage, useToast } from "@chakra-ui/react";

import { Layout } from "../layout";
import { addSavedWord } from "../firebase";

type FormInput = {
  spanish: string;
  english: string;
};

export function AddWord(): JSX.Element {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  const onAddWord = async (wordData: FormInput): Promise<void> => {
    try {
      await addSavedWord(wordData);
      toast({ title: "Word saved successfully", status: "success" });
      reset();
    } catch (err: any) {
      toast({ title: "Failed to save word", description: err.message, status: "error" });
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit(onAddWord)} style={{ width: "100%" }}>
        <VStack spacing={5} width="full">
          <Heading>Add Word</Heading>
          <FormControl>
            <FormLabel>Spanish</FormLabel>
            <Input id="spanish-word" {...register("spanish", { required: "This is required" })} />
          </FormControl>
          <FormErrorMessage>{errors.spanish ? errors.spanish.message : ""}</FormErrorMessage>
          <FormControl>
            <FormLabel>English</FormLabel>
            <Input id="english-word" {...register("english", { required: "This is required" })} />
          </FormControl>
          <FormErrorMessage>{errors.english ? errors.english.message : ""}</FormErrorMessage>
          <Button width="full" colorScheme="teal" size="lg" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </VStack>
      </form>
    </Layout>
  );
}
