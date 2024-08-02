import { Box, Flex, Heading, IconButton, MenuButton, Menu, MenuList, MenuItem } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { signOut } from "firebase/auth";

import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function AppBar(): JSX.Element {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const renderMenuList = (): JSX.Element => {
    if (currentUser) {
      return (
        <MenuList>
          <MenuItem color="black" onClick={() => navigate("/")}>
            Translate
          </MenuItem>
          <MenuItem color="black" onClick={() => navigate("/wordpacks")}>
            Wordpacks
          </MenuItem>
          <MenuItem color="black" onClick={() => navigate("/all-words")}>
            All Words
          </MenuItem>
          <MenuItem color="black" onClick={() => navigate("/add-word")}>
            Add Word
          </MenuItem>
          <MenuItem color="black" onClick={() => signOut(auth)}>
            Logout
          </MenuItem>
        </MenuList>
      );
    }

    return (
      <MenuList>
        <MenuItem color="black" onClick={() => navigate("/login")}>
          Login
        </MenuItem>
        <MenuItem color="black" onClick={() => navigate("/register")}>
          Register
        </MenuItem>
      </MenuList>
    );
  };

  return (
    <Box color="white" p={4} w="full" position="absolute" top={0} left={0}>
      <Flex justify="space-between" align="center">
        <Menu>
          <MenuButton as={IconButton} aria-label="Menu" icon={<HamburgerIcon />} />
          {renderMenuList()}
        </Menu>
        <Heading fontSize="xl" color="black">
          mylingo
        </Heading>
      </Flex>
    </Box>
  );
}
