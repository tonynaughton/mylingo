import { Box, Flex, Heading, IconButton, MenuButton, Menu, MenuList, MenuItem } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export function AppBar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <Box color="white" p={4} w="full">
      <Flex justify="space-between" align="center">
        <Menu>
          <MenuButton as={IconButton} aria-label="Menu" icon={<HamburgerIcon />} />
          <MenuList>
            <MenuItem color="black" onClick={() => navigate("/")}>
              Home
            </MenuItem>
            <MenuItem color="black" onClick={() => navigate("/my-words")}>
              My Words
            </MenuItem>
            <MenuItem color="black" onClick={() => navigate("/add-word")}>
              Add word
            </MenuItem>
            <MenuItem color="black" onClick={() => signOut(auth)}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        <Heading fontSize="xl" color="black">
          mylingo
        </Heading>
      </Flex>
    </Box>
  );
}
