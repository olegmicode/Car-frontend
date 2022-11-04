import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as React from "react";
import * as yup from "yup";

import { apiClient } from "../core/api";
import { useCurrentSpecContext } from "../core/contexts/current-spec";
import { useFieldContext } from "../core/contexts/field-context";
import { useSpecContext } from "../core/contexts/spec-context";
import { useAsync } from "../core/hooks/use-async";
import { FieldCreateModal } from "./FieldCreateModal";

const schema = yup.object({
  name: yup.string().required("Required"),
  fieldValues: yup.object(),
});

type FormValues = {
  name: string;
  fieldValues: Record<string, string>;
};

export function CarSpecEditor() {
  const { fields } = useFieldContext();
  const { currentSpec } = useCurrentSpecContext();
  const { reload: reloadSpecs } = useSpecContext();
  const isEditing = !!currentSpec;

  const fieldCreateDisclosure = useDisclosure();

  const [createSpec, { isLoading: isCreating }] = useAsync(
    apiClient.createSpec
  );
  const [updateSpec, { isLoading: isUpdating }] = useAsync(
    apiClient.updateSpec
  );
  const formik = useFormik<FormValues>({
    validationSchema: schema,
    initialValues: {
      name: "",
      fieldValues: {},
    },
    onSubmit: async (values) => {
      if (isEditing) {
        await updateSpec(currentSpec._id, values);
      } else {
        await createSpec(values);
      }
      reloadSpecs(true);
    },
  });
  const [fieldValuesTouched, setFieldValuesTouched] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    if (!currentSpec?._id) {
      formik.setValues({
        name: "",
        fieldValues: Object.fromEntries(fields.map((field) => [field._id, ""])),
      });

      return;
    }

    formik.setValues({
      name: currentSpec.name,
      fieldValues: currentSpec.fieldValues,
    });
  }, [currentSpec?._id]);

  return (
    <Box>
      <FormControl
        isInvalid={formik.touched.name && !!formik.errors.name}
        mb={3}
      >
        <FormLabel>Name</FormLabel>

        <Input
          type="name"
          value={formik.values.name}
          onBlur={formik.handleBlur}
          onChange={(e) => formik.setFieldValue("name", e.target.value)}
        />
        <FormErrorMessage>Name is required </FormErrorMessage>
      </FormControl>

      {fields.map((field) => (
        <FormControl
          key={field._id}
          mb={3}
          isInvalid={
            fieldValuesTouched[field._id] &&
            !formik.values.fieldValues[field._id]
          }
        >
          <FormLabel>{field.title}</FormLabel>

          <Select
            value={formik.values.fieldValues[field._id]}
            onChange={(e) =>
              formik.setFieldValue("fieldValues", {
                ...formik.values.fieldValues,
                [field._id]: e.target.value,
              })
            }
            onBlur={() =>
              setFieldValuesTouched({
                ...fieldValuesTouched,
                [field._id]: true,
              })
            }
          >
            <option value=""></option>
            {field.options.map((option) => (
              <option key={option._id} value={option._id}>
                {option.title}
              </option>
            ))}
          </Select>

          <FormErrorMessage>Required</FormErrorMessage>
        </FormControl>
      ))}

      <Flex>
        <Button mr="auto" onClick={fieldCreateDisclosure.onOpen}>
          New Field
        </Button>

        <Button
          onClick={() => formik.handleSubmit()}
          isLoading={isUpdating || isCreating}
          isDisabled={!formik.dirty && !formik.isValid}
        >
          Save
        </Button>
      </Flex>

      <FieldCreateModal
        isOpen={fieldCreateDisclosure.isOpen}
        onClose={fieldCreateDisclosure.onClose}
      />
    </Box>
  );
}
