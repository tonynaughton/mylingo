import { Box } from "@chakra-ui/react";

import { Layout } from "../layout";
import { AppBar } from "./app_bar";

export function Home(): JSX.Element {
  return (
    <Layout>
      <Box height="100%" width="full">
        <AppBar />
      </Box>
    </Layout>
  );
}
