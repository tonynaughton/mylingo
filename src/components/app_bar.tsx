import { Box, Flex, Text, Heading, IconButton, MenuButton, Menu, MenuList, MenuItem } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";

export function AppBar(): JSX.Element {
  return (
    <Box color="white" p={4}>
      <Flex justify="space-between" align="center">
        <Menu>
          <MenuButton as={IconButton} aria-label="Menu" icon={<HamburgerIcon />} />
          <MenuList>
            <MenuItem color="black">Add word</MenuItem>
            <MenuItem color="black" onClick={() => signOut(auth)}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        <Text fontSize="xl" color="black">
          <Heading>mylingo</Heading>
        </Text>
      </Flex>
    </Box>
  );
}
