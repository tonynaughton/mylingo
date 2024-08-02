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
  IconButton
} from "@chakra-ui/react";
import { Layout } from "../layout";
import { useEffect, useState } from "react";
import { deleteWordpack, getUserData, Wordpack } from "../firebase";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";

export function Wordpacks(): JSX.Element {
  const toast = useToast();
  const navigate = useNavigate();

  const [wordpacks, setWordpacks] = useState<Wordpack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const { wordpacks } = await getUserData();
      setWordpacks(wordpacks);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [count]);

  const onDeleteWordpack = async (wordpack: Wordpack): Promise<void> => {
    try {
      await deleteWordpack(wordpack);
      toast({ title: "Wordpack deleted successfully", status: "success" });
      setCount((prev) => prev + 1);
    } catch (err: any) {
      toast({ title: "Failed to delete wordpack", status: "error", description: err.message });
    }
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
                </Tr>
              </Thead>
              <Tbody>
                {wordpacks.map((wordpack, key) => (
                  <Tr key={key}>
                    <Td>{wordpack.title}</Td>
                    <Td>{wordpack.description}</Td>
                    <Td>
                      <IconButton
                        colorScheme="red"
                        size="xs"
                        aria-label={`delete-${wordpack.id}`}
                        isRound
                        icon={<CloseIcon />}
                        onClick={() => onDeleteWordpack(wordpack)}
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
  );
}
