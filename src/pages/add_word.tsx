import { useEffect, useState } from "react";
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
  Spinner,
  Select
} from "@chakra-ui/react";

import { Layout } from "../layout";
import { addWord, getUserData, Wordpack } from "../firebase";
import { getLanguageLabelByCode } from "../util/language";

export interface AddWordInput {
  wordpackId: string;
  native: string;
  target: string;
}

export function AddWord(): JSX.Element {
  const [nativeLabel, setNativeLabel] = useState<string | null>(null);
  const [targetLabel, settargetLabel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordPacks, setWordPacks] = useState<Wordpack[]>([]);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddWordInput>();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const { nativeCode, targetCode, wordpacks: wordPacks } = await getUserData();
      const nativeLabel = getLanguageLabelByCode(nativeCode);
      const targetLabel = getLanguageLabelByCode(targetCode);

      setNativeLabel(nativeLabel);
      settargetLabel(targetLabel);
      setWordPacks(wordPacks);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  const input = async (wordData: AddWordInput): Promise<void> => {
    try {
      await addWord(wordData);
      toast({ title: "Word saved successfully", status: "success" });
      reset();
    } catch (err: any) {
      toast({ title: "Failed to save word", description: err.message, status: "error" });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <VStack spacing={5}>
          <Text>Fetching data...</Text>
          <Spinner size="xl" />
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(input)} style={{ width: "100%" }}>
        <VStack spacing={5} width="full">
          <Heading>Add Word</Heading>
          <FormControl isInvalid={!!errors.wordpackId}>
            <FormLabel htmlFor="wordpack">Wordpack</FormLabel>
            <Select placeholder="Select a wordpack" {...register("wordpackId", { required: "Required" })} id="wordpack">
              {wordPacks.map((wordpack) => (
                <option value={wordpack.id}>{wordpack.title}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.wordpackId?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.target}>
            <FormLabel htmlFor="target-word">{targetLabel}</FormLabel>
            <Input id="target-word" {...register("target", { required: "Required" })} />
            <FormErrorMessage>{errors.target?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.native}>
            <FormLabel htmlFor="native-word">{nativeLabel}</FormLabel>
            <Input id="native-word" {...register("native", { required: "Required" })} />
            <FormErrorMessage>{errors.native?.message}</FormErrorMessage>
          </FormControl>
          <Button width="full" colorScheme="teal" size="lg" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </VStack>
      </form>
    </Layout>
  );
}
