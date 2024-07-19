import { useEffect, useState } from "react";
import { Button, Heading, Input, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { getSavedWords, WordData } from "../firebase";
import { useNavigate } from "react-router-dom";

type FormInput = { input: string };

export function TranslateCard(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [viewedWords, setViewedWords] = useState<WordData[]>([]);
  const [activeWord, setActiveWord] = useState<WordData | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { handleSubmit, register, reset, setValue } = useForm<FormInput>();

  useEffect((): void => {
    const getWords = async () => {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);
      setIsLoading(false);
    };

    getWords();
  }, []);

  useEffect((): void => {
    const updateWord = (): void => {
      const remainingWords = savedWords.filter((word) => !viewedWords.includes(word));

      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      setActiveWord(randomWord);
    };

    updateWord();
  }, [viewedWords, savedWords]);

  const onSubmit = async ({ input }: FormInput): Promise<void> => {
    toast.closeAll();
    if (input !== activeWord!.target) {
      toast({ title: "Incorrect", status: "error" });
      return;
    }

    toast({ title: "Correct", status: "success" });
    reset();
    setViewedWords((prev) => [...prev, activeWord!]);
  };

  const onResetClick = (): void => setViewedWords([]);

  const onRevealClick = (): void => setValue("input", activeWord!.target);

  const onAddWordsClick = (): void => navigate("/add-word");

  if (isLoading) {
    return (
      <VStack spacing={5}>
        <Text>Fetching saved words...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  if (!savedWords.length) {
    return (
      <VStack spacing={5}>
        <Heading>No saved words</Heading>
        <Button onClick={onAddWordsClick} size="lg" width="full">
          Add Words
        </Button>
      </VStack>
    );
  }

  if (viewedWords.length >= savedWords.length) {
    return (
      <VStack spacing={5}>
        <Heading>No words remaining</Heading>
        <Button onClick={onResetClick} size="lg" width="full">
          Reset
        </Button>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack spacing={5} p={5} width="full">
        <Heading as="h2" size="lg">
          Translate the word
        </Heading>
        <Text fontSize="xl">{activeWord?.native}</Text>
        <Input id="input" {...register("input", { required: "Translation required" })} />
        <Button size="lg" colorScheme="teal" width="full" type="submit">
          Submit
        </Button>
        <Button size="lg" width="full" onClick={onRevealClick}>
          Reveal
        </Button>
      </VStack>
    </form>
  );
}
