import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  Center,
  Spinner,
  chakra,
  Flex,
  Button,
} from "@chakra-ui/react";

import { apiClient } from "../core/api";
import { useAsync } from "../core/hooks/use-async";
import { useFieldContext } from "../core/contexts/field-context";
import { useSpecContext } from "../core/contexts/spec-context";
import { useCurrentSpecContext } from "../core/contexts/current-spec";

export function CarSpecList() {
  const { fields, optionsById } = useFieldContext();
  const { specs, isLoading: isSpecsLoading } = useSpecContext();
  const { currentSpec, setCurrentSpec } = useCurrentSpecContext();

  return (
    <>
      {!isSpecsLoading && specs && (
        <Accordion
          index={currentSpec ? specs.indexOf(currentSpec) : undefined}
          onChange={(expandedIndex) => {
            console.log(expandedIndex);
            setCurrentSpec(
              expandedIndex ? specs[expandedIndex as number] : null
            );
          }}
        >
          {specs?.map((spec) => (
            <AccordionItem key={spec._id}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {spec.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <dl>
                  {fields.map((field) => (
                    <Flex>
                      <dt>{field.title}:&nbsp;</dt>
                      <dd>
                        {spec.fieldValues[field._id]
                          ? optionsById[spec.fieldValues[field._id]].title
                          : ""}
                      </dd>
                    </Flex>
                  ))}
                </dl>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Flex mt={3}>
        <Button ml="auto" onClick={() => setCurrentSpec(null)}>
          New Spec
        </Button>
      </Flex>

      {isSpecsLoading && (
        <Center>
          <Spinner />
        </Center>
      )}
    </>
  );
}
