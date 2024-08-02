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
import { addSavedWord, getUserData, WordPack } from "../firebase";
import { getLanguageLabelByCode } from "../util/language";

type FormInput = {
  wordPackId: string;
  native: string;
  target: string;
};

export function AddWord(): JSX.Element {
  const [nativeLabel, setNativeLabel] = useState<string | null>(null);
  const [targetLabel, settargetLabel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordPacks, setWordPacks] = useState<WordPack[]>([]);

  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormInput>();

  useEffect(() => {
    const getData = async (): Promise<void> => {
      const { nativeCode, targetCode, wordPacks } = await getUserData();
      const native = getLanguageLabelByCode(nativeCode);
      const target = getLanguageLabelByCode(targetCode);

      setNativeLabel(native);
      settargetLabel(target);
      setWordPacks(wordPacks);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  const onAddWord = async (wordData: FormInput): Promise<void> => {
    try {
      await addSavedWord({ ...wordData, dateAdded: Date.now() });
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
      <form onSubmit={handleSubmit(onAddWord)} style={{ width: "100%" }}>
        <VStack spacing={5} width="full">
          <Heading>Add Word</Heading>
          <FormControl>
            <FormLabel htmlFor="wordpack">Wordpack</FormLabel>
            <Select
              placeholder="Select a wordpack"
              {...register("wordPackId", { required: "This is required" })}
              id="wordpack"
            >
              {wordPacks.map((wordpack) => (
                <option value={wordpack.id}>{wordpack.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="target-word">{targetLabel}</FormLabel>
            <Input id="target-word" {...register("target", { required: "This is required" })} />
          </FormControl>
          <FormErrorMessage>{errors.native ? errors.native.message : ""}</FormErrorMessage>
          <FormControl>
            <FormLabel htmlFor="native-word">{nativeLabel}</FormLabel>
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
