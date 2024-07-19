import { useEffect, useState } from "react";
import {
  VStack,
  Text,
  Spinner,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  useToast,
  Button
} from "@chakra-ui/react";

import { Layout } from "../layout";
import { deleteWord, getLanguageData, getSavedWords, WordData } from "../firebase";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

export function MyWords(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();
  const [languageData, setLanguageData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function getData() {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);

      const data = await getLanguageData();
      setLanguageData(data);
    }

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [count]);

  const onDeleteWord = async (word: WordData): Promise<void> => {
    try {
      await deleteWord(word);
      toast({ title: "Word deleted successfully", status: "success" });
      setCount((prev) => prev + 1);
    } catch (err: any) {
      toast({ title: "Failed to delete word", status: "error", description: err.message });
    }
  };

  const onAddWordsClick = (): void => navigate("/add-word");

  if (!savedWords.length) {
    return (
      <Layout>
        <VStack spacing={5}>
          <Heading>No saved words</Heading>
          <Button onClick={onAddWordsClick} size="lg" width="full">
            Add Words
          </Button>
        </VStack>
      </Layout>
    );
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
    <Layout>
      <VStack spacing={5} maxHeight="100%" width="full">
        <Heading as="h2" size="lg">
          My Words
        </Heading>
        <TableContainer width="full" overflowY="auto">
          <Table width="full" variant="simple">
            <Thead>
              <Tr>
                <Th>{languageData?.native}</Th>
                <Th>{languageData?.target}</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {savedWords.map((word, key) => (
                <Tr key={key}>
                  <Td>{word.native}</Td>
                  <Td>{word.target}</Td>
                  <Td>
                    <IconButton
                      colorScheme="red"
                      size="xs"
                      aria-label={`delete-${word.native}`}
                      isRound
                      icon={<CloseIcon />}
                      onClick={() => onDeleteWord(word)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Layout>
  );
}
