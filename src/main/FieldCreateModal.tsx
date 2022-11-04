import * as React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalOverlay,
  ModalContent,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as yup from "yup";

import { useAsync } from "../core/hooks/use-async";
import { apiClient, FieldOption, Field } from "../core/api";
import { useFieldContext } from "../core/contexts/field-context";

export type FieldCreateModalProps = Omit<ModalProps, "children">;

const schema = yup.object({
  title: yup.string().required("Required"),
  options: yup.array().of(
    yup.object({
      title: yup.string().required("Required"),
    })
  ),
  newOption: yup.string(),
});

type FormValues = Omit<Field, "_id"> & {
  newOption: string;
};

export function FieldCreateModal(props: FieldCreateModalProps) {
  const { reload } = useFieldContext();
  const [createField, { isLoading: isSaving }] = useAsync(
    apiClient.createField
  );

  const formik = useFormik<FormValues>({
    validationSchema: schema,
    initialValues: {
      title: "",
      options: [] as FieldOption[],
      newOption: "",
    },
    onSubmit: async ({ title, options }) => {
      await createField({ title, options });
      reload(true);
      props.onClose();
    },
  });

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Field</ModalHeader>
        <ModalBody>
          <FormikProvider value={formik}>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={formik.values.title}
                onBlur={formik.handleBlur}
                onChange={(e) => formik.setFieldValue("title", e.target.value)}
              />
              <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
            </FormControl>

            <FieldArray
              name="options"
              render={(arrayHelpers) => (
                <div>
                  <FormLabel>Options</FormLabel>
                  {formik.values.options.map((option, index) => (
                    <FormControl
                      key={index}
                      isInvalid={!!formik.errors?.options?.[index]}
                      mb={3}
                    >
                      <Flex>
                        <Input
                          type="text"
                          name={`options[${index}].title`}
                          value={option.title}
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            arrayHelpers.replace(index, {
                              ...option,
                              title: e.target.value,
                            });
                          }}
                        />
                        <IconButton
                          ml="3"
                          aria-label="Delete Item"
                          icon={<DeleteIcon />}
                          onClick={() => arrayHelpers.remove(index)}
                        />
                      </Flex>
                      <FormErrorMessage>
                        {formik.errors.options?.[index]}
                      </FormErrorMessage>
                    </FormControl>
                  ))}

                  <FormControl mt={3}>
                    <Flex>
                      <Input
                        type="text"
                        name="newOption"
                        value={formik.values.newOption}
                        onBlur={formik.handleBlur}
                        onChange={(e) =>
                          formik.setFieldValue("newOption", e.target.value)
                        }
                      />
                      <IconButton
                        ml="3"
                        aria-label="New Item"
                        icon={<AddIcon />}
                        onClick={() => {
                          formik.setFieldValue("newOption", "");
                          arrayHelpers.push({ title: formik.values.newOption });
                        }}
                      />
                    </Flex>
                  </FormControl>
                </div>
              )}
            />
          </FormikProvider>
        </ModalBody>

        <ModalFooter d="flex">
          <Button
            ml="auto"
            onClick={() => formik.handleSubmit()}
            isLoading={isSaving}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
