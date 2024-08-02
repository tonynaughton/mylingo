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
  Button
} from "@chakra-ui/react";
import { Layout } from "../layout";
import { useEffect, useState } from "react";
import { getUserData, Wordpack } from "../firebase";
import { useNavigate } from "react-router-dom";

export function Wordpacks(): JSX.Element {
  const navigate = useNavigate();

  const [wordpacks, setWordpacks] = useState<Wordpack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { wordpacks } = await getUserData();
      setWordpacks(wordpacks);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

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
                {wordpacks.map((wordPack, key) => (
                  <Tr key={key}>
                    <Td>{wordPack.title}</Td>
                    <Td>{wordPack.description}</Td>
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
