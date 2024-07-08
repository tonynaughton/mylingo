import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getSavedWords } from "../firebase";

export function WordCard(): JSX.Element {
  const [activeWord, setActiveWord] = useState<string>("Word");
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    async function getData() {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);
    }

    getData();
  }, []);

  return (
    <VStack>
      <Text>{activeWord}</Text>
      <Input />
      <Button width="full">Enter</Button>
    </VStack>
  );
}
