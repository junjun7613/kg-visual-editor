import type { Entity } from "~/types";

export const useEditor = () => {
  const content_state_api = useState<string>("content_state_api", () => "");

  const annotation_result = useState<Entity[]>("annotation_result", () => []);

  const curation_type_select = useState<Entity[]>("curation_type_select", () => []);

  const curation_data = useState<Entity[]>("curation_data", () => []);

  const curationURIs = useState<Entity[]>("curations", () => []);

  return {
    content_state_api,
    annotation_result,
    curation_type_select,
    curation_data,
    curationURIs,
  };
};
