import axios, { AxiosResponse } from "axios";

import {
  Field,
  FieldCreateDTO,
  Spec,
  SpecCreateDTO,
  SpecUpdateDTO,
} from "./types";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export function loadFields() {
  return apiClient.get<Field[]>("/fields");
}

export function createField(dto: FieldCreateDTO) {
  return apiClient.post<FieldCreateDTO, AxiosResponse<FieldCreateDTO>>(
    "/fields",
    dto
  );
}

export function loadSpecs() {
  return apiClient.get<Spec[]>("/specs");
}

export function createSpec(dto: SpecCreateDTO) {
  return apiClient.post<SpecCreateDTO, AxiosResponse<Spec>>("/specs", dto);
}

export function updateSpec(id: string, dto: SpecUpdateDTO) {
  return apiClient.put<SpecUpdateDTO, AxiosResponse<Spec>>(`/specs/${id}`, dto);
}

export function deleteSpec(id: string) {
  return apiClient.delete(`/specs/${id}`);
}
