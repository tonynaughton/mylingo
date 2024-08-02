import { useEffect, useState } from "react";
import { Button, FormControl, FormErrorMessage, Input, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { getUserData, Word } from "../firebase";
import { ALL_WORDPACKS_KEY } from "../pages";

interface TranslateCardProps {
  onFinish(): void;
  selectedWordpackId?: string;
}

interface TranslateInput {
  translation: string;
}

export function TranslateCard({ onFinish, selectedWordpackId }: TranslateCardProps): JSX.Element {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [viewedWords, setViewedWords] = useState<Word[]>([]);
  const [activeWord, setActiveWord] = useState<Word | null>(null);
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TranslateInput>();

  useEffect((): void => {
    const getWords = async () => {
      setIsLoading(true);
      try {
        const { words } = await getUserData();

        if (selectedWordpackId === ALL_WORDPACKS_KEY) {
          setWords(words);
        } else {
          const filteredWords = words.filter((word) => word.wordpackId === selectedWordpackId);
          setWords(filteredWords);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getWords();
  }, []);

  useEffect((): void => {
    const updateWord = (): void => {
      const remainingWords = words.filter((word) => !viewedWords.includes(word));

      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      setActiveWord(randomWord);
    };

    updateWord();
  }, [viewedWords, words]);

  const onSubmit = async ({ translation: input }: TranslateInput): Promise<void> => {
    toast.closeAll();
    if (input.toLowerCase() !== activeWord!.target.toLowerCase()) {
      toast({ title: "Incorrect", status: "error" });
      return;
    }

    toast({ title: "Correct", status: "success" });
    reset();
    setViewedWords((prev) => [...prev, activeWord!]);
  };

  const onFinishClick = (): void => {
    setViewedWords([]);
    onFinish();
  };

  const onRevealClick = (): void => setValue("translation", activeWord!.target);

  if (isLoading) {
    return (
      <VStack spacing={5} width="full">
        <Text>Fetching words...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  if (viewedWords.length >= words.length) {
    return (
      <VStack spacing={5} width="full">
        <Text>No words remaining</Text>
        <Button onClick={onFinishClick} size="lg" width="full">
          Finish
        </Button>
      </VStack>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack spacing={5} p={5} width="full">
        <Text fontSize="xl">{activeWord?.native}</Text>
        <FormControl>
          <Input id="input" {...register("translation", { required: "Required" })} />
          <FormErrorMessage>{errors.translation?.message}</FormErrorMessage>
        </FormControl>
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
