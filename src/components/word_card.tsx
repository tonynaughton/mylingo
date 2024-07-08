import { useEffect, useState } from "react";
import { Button, Heading, Input, Spinner, Text, VStack } from "@chakra-ui/react";

import { getSavedWords, WordData } from "../firebase";

export function WordCard(): JSX.Element {
  const [activeWord, setActiveWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <VStack spacing={5}>
        <Text>Fetching saved words...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  return (
    <VStack spacing={5} p={5} width="full">
      <Heading as="h2" size="lg">
        Translate the word
      </Heading>
      <Text fontSize="xl">{activeWord?.english}</Text>
      <Input />
      <Button colorScheme="teal" width="full">
        Submit
      </Button>
    </VStack>
  );
}
