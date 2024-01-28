export const useEditor = () => {
    const content_state_api = useState<string>("content_state_api", () => "");

    return {
        content_state_api
    }
};

