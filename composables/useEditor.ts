import type { Entity } from "~/types";

export const useEditor = () => {
  const content_state_api = useState<string>("content_state_api", () => "");

  const annotation_result = useState<Entity[]>("annotation_result", () => []);

  return {
    content_state_api,
    annotation_result,
  };
};
