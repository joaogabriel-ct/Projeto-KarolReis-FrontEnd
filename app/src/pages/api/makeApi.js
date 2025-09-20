import { getAPIClient } from "./axios";

// Note: This should be used with await since getAPIClient is async
export const getApi = async () => {
  return await getAPIClient();
};