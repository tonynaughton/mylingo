import { Layout } from "../layout";
import { TranslateCard } from "../components/translate_card";
import { Text, Spinner, FormControl, Heading, Select, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getUserData, Wordpack } from "../firebase";
import { useNavigate } from "react-router-dom";

export const ALL_WORDPACKS_KEY = "ALL_WORDPACKS";

export function Translate(): JSX.Element {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [wordpacks, setWordpacks] = useState<Wordpack[]>([]);
  const [selectedWordpackId, setSelectedWordpackId] = useState<string>(ALL_WORDPACKS_KEY);

  useEffect((): void => {
    const getData = async () => {
      const { wordpacks } = await getUserData();
      setWordpacks(wordpacks);
    };

    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  const wordpackOptions: { title: string; value: string }[] = [
    { value: ALL_WORDPACKS_KEY, title: "All Wordpacks" },
    ...wordpacks.map(({ id, title }) => ({ value: id, title }))
  ];

  const onAddWordpackClick = (): void => navigate("/add-wordpack");

  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <VStack spacing={5}>
          <Text>Fetching data...</Text>
          <Spinner size="xl" />
        </VStack>
      );
    }

    if (!wordpacks.length) {
      return (
        <VStack spacing={5}>
          <Text>No wordpacks added yet</Text>
          <Button onClick={onAddWordpackClick} size="lg" width="full">
            Add Wordpack
          </Button>
        </VStack>
      );
    }

    if (isStarted) {
      return <TranslateCard onFinish={() => setIsStarted(false)} selectedWordpackId={selectedWordpackId} />;
    }

    return (
      <VStack spacing={5} padding={5} width="full">
        <FormControl>
          <Select id="wordpack" onChange={(e) => setSelectedWordpackId(e.target.value)}>
            {wordpackOptions.map((wordpack, key) => (
              <option key={key} value={wordpack.value}>
                {wordpack.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button size="lg" width="full" onClick={() => setIsStarted(true)}>
          Start
        </Button>
      </VStack>
    );
  };

  return (
    <Layout>
      <VStack spacing={5} width="full">
        <Heading as="h2" size="lg">
          Translate
        </Heading>
        {renderContent()}
      </VStack>
    </Layout>
  );
}
