import { VStack, Text, Spinner, Heading, TableContainer, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

import { Layout } from "../layout";
import { getSavedWords, WordData } from "../firebase";
import { useEffect, useState } from "react";

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
      <>
        <Heading my={4}>My Words</Heading>
        <TableContainer width="full">
          <Table width="full" variant="simple">
            <Thead>
              <Tr>
                <Th>English</Th>
                <Th>Spanish</Th>
              </Tr>
            </Thead>
            <Tbody>
              {savedWords.map((word) => (
                <Tr>
                  <Td>{word.english}</Td>
                  <Td>{word.spanish}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    </Layout>
  );
}
