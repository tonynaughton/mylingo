import { useEffect, useState } from "react";
import { Button, Heading, Input, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { getSavedWords, WordData } from "../firebase";

export function WordCard(): JSX.Element {
  const toast = useToast();
  const [activeWord, setActiveWord] = useState<WordData | null>(null);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [viewedWords, setViewedWords] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noRemainingWords, setNoRemainingWords] = useState(false);

  const { handleSubmit, register, reset } = useForm<{ input: string }>();

  useEffect(() => {
    async function getData() {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);

      updateWord();

      setIsLoading(false);
    }

    getData();
  }, []);

  function updateWord() {
    const remainingWords = savedWords.filter((word) => !viewedWords.includes(word));

    if (!remainingWords.length) {
      setNoRemainingWords(true);
    }

    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    setActiveWord(randomWord);
    setViewedWords((prevViewedWords) => [...prevViewedWords, randomWord]);
  }

  async function onTranslationSubmit(translation: { input: string }) {
    if (translation.input === activeWord?.spanish) {
      toast({
        title: "Correct",
        status: "success",
        duration: 5000,
        isClosable: true
      });

      reset();
      updateWord();
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
      <VStack spacing={5}>
        <Text>Fetching saved words...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  if (noRemainingWords) {
    return (
      <VStack spacing={5}>
        <Heading>No words remaining!</Heading>
        <Button
          onClick={() => {
            console.log("Reset clicked");
            setNoRemainingWords(false);
            setViewedWords([]);
            updateWord();
          }}
          size="lg"
          width="full"
        >
          Reset
        </Button>
      </VStack>
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
