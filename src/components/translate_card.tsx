import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { getUserData, Word } from "../firebase";
import { useNavigate } from "react-router-dom";

interface TranslateInput {
  translation: string;
}

export function TranslateCard(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [viewedWords, setViewedWords] = useState<Word[]>([]);
  const [activeWord, setActiveWord] = useState<Word | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors }
  } = useForm<TranslateInput>();

  useEffect((): void => {
    const getWords = async () => {
      const { words } = await getUserData();
      setWords(words);
    };

    setIsLoading(true);
    getWords();
    setIsLoading(false);
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

  const onResetClick = (): void => setViewedWords([]);

  const onRevealClick = (): void => setValue("translation", activeWord!.target);

  const onAddWordsClick = (): void => navigate("/add-word");

  if (isLoading) {
    return (
      <VStack spacing={5}>
        <Text>Fetching saved words...</Text>
        <Spinner size="xl" />
      </VStack>
    );
  }

  if (!words.length) {
    return (
      <VStack spacing={5}>
        <Heading>No saved words</Heading>
        <Button onClick={onAddWordsClick} size="lg" width="full">
          Add Words
        </Button>
      </VStack>
    );
  }

  if (viewedWords.length >= words.length) {
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
