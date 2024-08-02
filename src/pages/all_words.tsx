import { useEffect, useRef, useState } from "react";
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
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay
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
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [count, setCount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const wordpacksById = _.keyBy(wordpacks, "id");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { nativeCode, targetCode, wordpacks, words } = await getUserData();
        const nativeLabel = getLanguageLabelByCode(nativeCode);
        const targetLabel = getLanguageLabelByCode(targetCode);

        setNativeLabel(nativeLabel);
        settargetLabel(targetLabel);
        setWordpacks(wordpacks);
        setWords(words);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [count]);

  const onDeleteWord = async (): Promise<void> => {
    try {
      if (selectedWord) {
        await deleteWord(selectedWord);
        toast({ title: "Word deleted successfully", status: "success" });
        setCount((prev) => prev + 1);
      }
    } catch (err: any) {
      toast({ title: "Failed to delete word", status: "error", description: err.message });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const onOpenDialog = (word: Word): void => {
    setSelectedWord(word);
    setIsDialogOpen(true);
  };

  const onCloseDialog = (): void => {
    setSelectedWord(null);
    setIsDialogOpen(false);
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
    <>
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
                    <Td>{wordpacksById[word.wordpackId]?.title || "N/A"}</Td>
                    <Td>
                      <IconButton
                        colorScheme="red"
                        size="xs"
                        aria-label={`Delete word ${word.id}`}
                        isRound
                        icon={<CloseIcon />}
                        onClick={() => onOpenDialog(word)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Layout>
      <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={onCloseDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Word
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to delete this word?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDeleteWord} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
