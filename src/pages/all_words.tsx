import { useEffect, useState } from "react";
import _ from "lodash";
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
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import { deleteWord, getUserData, Word, Wordpack } from "../firebase";
import { Layout } from "../layout";
import { getLanguageLabelByCode } from "../util/language";

export function AllWords(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const [nativeLabel, setNativeLabel] = useState<string | null>(null);
  const [targetLabel, settargetLabel] = useState<string | null>(null);
  const [wordpacks, setWordpacks] = useState<Wordpack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [count, setCount] = useState(0);

  const wordpacksById = _.keyBy(wordpacks, "id");

  useEffect(() => {
    const getData = async () => {
      const { nativeCode, targetCode, wordpacks, words } = await getUserData();
      const nativeLabel = getLanguageLabelByCode(nativeCode);
      const targetLabel = getLanguageLabelByCode(targetCode);

      setNativeLabel(nativeLabel);
      settargetLabel(targetLabel);
      setWordpacks(wordpacks);
      setWords(words);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [count]);

  const onDeleteWord = async (word: Word): Promise<void> => {
    try {
      await deleteWord(word);
      toast({ title: "Word deleted successfully", status: "success" });
      setCount((prev) => prev + 1);
    } catch (err: any) {
      toast({ title: "Failed to delete word", status: "error", description: err.message });
    }
  };

  const onAddWordsClick = (): void => navigate("/add-word");

  if (!words.length) {
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
          All Words
        </Heading>
        <TableContainer width="full" overflowY="auto">
          <Table width="full" variant="simple">
            <Thead>
              <Tr>
                <Th>{nativeLabel}</Th>
                <Th>{targetLabel}</Th>
                <Th>Wordpack</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {words.map((word, key) => (
                <Tr key={key}>
                  <Td>{word.native}</Td>
                  <Td>{word.target}</Td>
                  <Td>{wordpacksById[word.wordpackId].title}</Td>
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
