import { Layout } from "../layout";
import { WordCard } from "../components/word_card";

export function Home(): JSX.Element {
  return (
    <Layout>
      <WordCard />
    </Layout>
  );
}
