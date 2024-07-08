import { useEffect, useState } from "react";
import { Button, Heading, Input, Spinner, Text, useToast, VStack } from "@chakra-ui/react";

import { getSavedWords, WordData } from "../firebase";
import { useForm } from "react-hook-form";
import { Layout } from "../layout";

export function WordCard(): JSX.Element {
  const toast = useToast();
  const [activeWord, setActiveWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { handleSubmit, register } = useForm<{ input: string }>();

  useEffect(() => {
    async function getData() {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);

      const randomWord = savedWords[Math.floor(Math.random() * savedWords.length)];
      setActiveWord(randomWord);

      setIsLoading(false);
    }

    getData();
  }, []);

  async function onTranslationSubmit(translation: { input: string }) {
    if (translation.input === activeWord?.spanish) {
      toast({
        title: "Correct",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } else {
      toast({
        title: "Incorrect",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <VStack spacing={5}>
          <Text>Fetching saved words...</Text>
          <Spinner size="xl" />
        </VStack>
      </Layout>
    );
  }

  return (
    <form onSubmit={handleSubmit(onTranslationSubmit)} style={{ width: "100%" }}>
      <VStack spacing={5} p={5} width="full">
        <Heading as="h2" size="lg">
          Translate the word
        </Heading>
        <Text fontSize="xl">{activeWord?.english}</Text>
        <Input id="translation-input" {...register("input", { required: "Translation required" })} />
        <Button size="lg" colorScheme="teal" width="full" type="submit">
          Submit
        </Button>
      </VStack>
    </form>
  );
}
