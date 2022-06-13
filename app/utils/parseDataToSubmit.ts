export function parseDataToSubmit(data: object) {
  return {
    data: JSON.stringify(
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          if (typeof value === 'string' && value.length === 0)
            return [key, null];
          return [key, value];
        })
      )
    ),
  };
}
