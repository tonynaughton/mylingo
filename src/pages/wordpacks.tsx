import {
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Button,
  useToast,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay
} from "@chakra-ui/react";
import _ from "lodash";
import { Layout } from "../layout";
import { useEffect, useState, useRef } from "react";
import { deleteWordpack, getUserData, Word, Wordpack } from "../firebase";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";

export function Wordpacks(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const [wordpacks, setWordpacks] = useState<Wordpack[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWordpack, setSelectedWordpack] = useState<Wordpack | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const countsByWordpackId = _.countBy(words, "wordpackId");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const { wordpacks, words } = await getUserData();
        setWordpacks(wordpacks);
        setWords(words);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [count]);

  const onDeleteWordpack = async (): Promise<void> => {
    try {
      if (selectedWordpack) {
        await deleteWordpack(selectedWordpack);
        toast({ title: "Wordpack deleted successfully", status: "success" });
        setCount((prev) => prev + 1);
      }
    } catch (err: any) {
      toast({ title: "Failed to delete wordpack", status: "error", description: err.message });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const onOpenDialog = (wordpack: Wordpack): void => {
    setSelectedWordpack(wordpack);
    setIsDialogOpen(true);
  };

  const onCloseDialog = (): void => {
    setSelectedWordpack(null);
    setIsDialogOpen(false);
  };

  const onAddWordpack = (): void => navigate("/add-wordpack");

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
            Wordpacks
          </Heading>
          {!wordpacks.length ? (
            <Text>You haven't added any wordpacks yet!</Text>
          ) : (
            <TableContainer width="full" overflowY="auto">
              <Table width="full" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>Description</Th>
                    <Th>Count</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {wordpacks.map((wordpack, key) => (
                    <Tr key={key}>
                      <Td>{wordpack.title}</Td>
                      <Td>{wordpack.description}</Td>
                      <Td>{countsByWordpackId[wordpack.id] || 0}</Td>
                      <Td>
                        <IconButton
                          colorScheme="red"
                          size="xs"
                          aria-label={`Delete wordpack ${wordpack.id}`}
                          isRound
                          icon={<CloseIcon />}
                          onClick={() => onOpenDialog(wordpack)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <Button width="full" size="lg" colorScheme="teal" onClick={onAddWordpack}>
            Add Wordpack
          </Button>
        </VStack>
      </Layout>

      <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={onCloseDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Wordpack
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete '{selectedWordpack?.title}'?
              <br />
              <br /> <b>This will also delete all words added to this wordpack.</b>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onDeleteWordpack} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
