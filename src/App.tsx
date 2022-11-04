import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { CarSpecList } from "./main/CarSpecList";

import { useAsync } from "./core/hooks/use-async";
import { apiClient } from "./core/api";
import { FieldContextProvider } from "./core/contexts/field-context";
import { CarSpecEditor } from "./main/CarSpecEditor";
import { CurrentSpecContextProvider } from "./core/contexts/current-spec";
import { SpecContextProvider } from "./core/contexts/spec-context";

function App() {
  return (
    <ChakraProvider>
      <SpecContextProvider>
        <CurrentSpecContextProvider>
          <FieldContextProvider
            render={({ isLoading }: { isLoading: boolean }) =>
              isLoading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <Flex height="100vh">
                  <Box w="50%" p={3} borderRight="1px solid gray">
                    <CarSpecList />
                  </Box>
                  <Box w="50%" p={3}>
                    <CarSpecEditor />
                  </Box>
                </Flex>
              )
            }
          />
        </CurrentSpecContextProvider>
      </SpecContextProvider>
    </ChakraProvider>
  );
}

export default App;
