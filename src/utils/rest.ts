export const rest = <Response = unknown>(
  path: string,
  method: "GET" | "POST" = "POST"
): Promise<Response> => {
  return fetch(`http://localhost:3000${path}`, {
    method,
  }).then((response) => response.json());
};
