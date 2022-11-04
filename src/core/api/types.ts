export type Field = {
  _id: string;
  title: string;
  options: FieldOption[];
};

export type Spec = {
  _id: string;
  name: string;
  fieldValues: Record<string, string>;
};

export type FieldCreateDTO = {
  title: string;
  options: { title: string }[];
};

export type SpecCreateDTO = Omit<Spec, "_id">;

export type SpecUpdateDTO = SpecCreateDTO;

export type FieldOption = {
  _id: string;
  title: string;
};
