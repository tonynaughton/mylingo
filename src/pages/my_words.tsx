import { useEffect, useState } from "react";
import { VStack, Text, Spinner, Heading, TableContainer, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

import { Layout } from "../layout";
import { getSavedWords, WordData } from "../firebase";

export function MyWords(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);

  useEffect(() => {
    async function getData() {
      const savedWords = await getSavedWords();
      setSavedWords(savedWords);

      setIsLoading(false);
    }

    getData();
  }, []);

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
      <VStack spacing={5}  height='full' width="full">
      <Heading as="h2" size="lg">My Words</Heading>
      <TableContainer width="full" height="full" overflowY="auto">
        <Table width="full" variant="simple" height="full" >
          <Thead>
            <Tr>
              <Th>English</Th>
              <Th>Spanish</Th>
            </Tr>
          </Thead>
          <Tbody>
            {savedWords.map((word, key) => (
              <Tr key={key}>
                <Td>{word.english}</Td>
                <Td>{word.spanish}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      </VStack>
    </Layout>
  );
}
