import { useEffect, useState } from "react";
import { VStack, Text, Spinner, Heading, TableContainer, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

import { Layout } from "../layout";
import { getLanguageData, getSavedWords, WordData } from "../firebase";

export function MyWords(): JSX.Element {
  const [languageData, setLanguageData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedWords, setSavedWords] = useState<WordData[]>([]);

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
              </Tr>
            </Thead>
            <Tbody>
              {savedWords.map((word, key) => (
                <Tr key={key}>
                  <Td>{word.native}</Td>
                  <Td>{word.target}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Layout>
  );
}
