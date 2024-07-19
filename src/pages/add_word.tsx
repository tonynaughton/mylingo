import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Text,
  Spinner
} from "@chakra-ui/react";

import { Layout } from "../layout";
import { addSavedWord, getLanguageData, WordData } from "../firebase";
import { useEffect, useState } from "react";

type FormInput = {
  native: string;
  target: string;
};

export function AddWord(): JSX.Element {
  const [languageData, setLanguageData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const data = await getLanguageData();
      setLanguageData(data);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  const onAddWord = async (wordData: FormInput): Promise<void> => {
    try {
      await addSavedWord(wordData);
      toast({ title: "Word saved successfully", status: "success" });
      reset();
    } catch (err: any) {
      toast({ title: "Failed to save word", description: err.message, status: "error" });
    }
  };

  if (isLoading) {
    return (
      <VStack spacing={5}>
        <Text>Fetching data...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onAddWord)} style={{ width: "100%" }}>
        <VStack spacing={5} width="full">
          <Heading>Add Word</Heading>
          <FormControl>
            <FormLabel htmlFor="target-word">{languageData?.target}</FormLabel>
            <Input id="target-word" {...register("target", { required: "This is required" })} />
          </FormControl>
          <FormErrorMessage>{errors.native ? errors.native.message : ""}</FormErrorMessage>
          <FormControl>
            <FormLabel htmlFor="native-word">{languageData?.native}</FormLabel>
            <Input id="native-word" {...register("native", { required: "This is required" })} />
          </FormControl>
          <FormErrorMessage>{errors.target ? errors.target.message : ""}</FormErrorMessage>
          <Button width="full" colorScheme="teal" size="lg" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </VStack>
      </form>
    </Layout>
  );
}
