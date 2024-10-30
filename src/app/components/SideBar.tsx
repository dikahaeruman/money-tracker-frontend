"use client"
import { Box, VStack, Text, Button, Input, Checkbox, Stack, CheckboxGroup } from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import React from 'react';
import { useState, useCallback } from 'react';

type ExpandedSections = {
  accounts: boolean;
  categories: boolean;
  labels: boolean;
  currencies: boolean;
  recordTypes: boolean;
  amountRange: boolean;
  paymentTypes: boolean;
  recordStates: boolean;
};

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState<ExpandedSections>({
    accounts: false,
    categories: false,
    labels: false,
    currencies: false,
    recordTypes: false,
    amountRange: false,
    paymentTypes: false,
    recordStates: false,
  });

  const toggleSection = useCallback((section: keyof ExpandedSections) => {
    setIsExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  return (
    <Box w="250px" bg="gray.50" p={4} boxShadow="md">
      <Button w="100%" colorScheme="green" mb={4}>
        + Add
      </Button>
      <Input placeholder="Search" mb={4} />

      <VStack align="start">
        <Text fontWeight="bold">FILTER</Text>

        <Stack w="100%">
          <Text fontSize="sm" onClick={() => toggleSection('accounts')} cursor="pointer">
            ACCOUNTS <Text as="span" color="blue.500">6</Text>
          </Text>
          <Collapse in={isExpanded.accounts} animateOpacity>
            {/* <Checkbox>Account 1</Checkbox>
            <Checkbox>Account 2</Checkbox> */}
          </Collapse>
        </Stack>

        <Stack gap={2} w="100%">
          <Text fontSize="sm" onClick={() => toggleSection('categories')} cursor="pointer">
            CATEGORIES <Text as="span" color="blue.500">All</Text>
          </Text>
          <Collapse in={isExpanded.categories} animateOpacity>
            <VStack align="start" w="100%">
              {/* <Checkbox defaultChecked>Category 1</Checkbox>
              <Checkbox>Category 2</Checkbox> */}
            </VStack>
          </Collapse>
        </Stack>

        <Stack w="100%" gap={2}>
          <Text fontSize="sm" onClick={() => toggleSection('labels')} cursor="pointer">
            LABELS <Text as="span" color="gray.500">None</Text>
          </Text>
          <Collapse in={isExpanded.labels} animateOpacity>
            {/* <Checkbox>Label 1</Checkbox>
            <Checkbox>Label 2</Checkbox> */}
          </Collapse>
        </Stack>

        <Stack gap={2} w="100%">
          <Text fontSize="sm" onClick={() => toggleSection('recordTypes')} cursor="pointer">
            RECORD TYPES <Text as="span" color="blue.500">All</Text>
          </Text>
          <Collapse in={isExpanded.recordTypes} animateOpacity>
            <CheckboxGroup defaultValue={["All Record Types", "Income", "Expense", "Transfer"]}>
              {/* <Checkbox value="All Record Types">All Record Types</Checkbox>
              <Checkbox value="Income">Income</Checkbox>
              <Checkbox value="Expense">Expense</Checkbox>
              <Checkbox value="Transfer">Transfer</Checkbox> */}
            </CheckboxGroup>
          </Collapse>
        </Stack>

        {/* Add other sections similarly */}
      </VStack>
    </Box>
  );
}

export default Sidebar;