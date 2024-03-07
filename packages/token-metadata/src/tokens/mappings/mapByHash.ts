import { TokenMetaBase } from '../../types'

  export const getMappedTokensByHash = (tokens: Record<string, TokenMetaBase>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {

      if (!tokens[token].ibcs || tokens[token].ibcs?.length === 0) {
        return result;
      }

      tokens[token].ibcs?.forEach(ibc => {
        if (ibc.hash) {
          const hashKey = ibc.hash.toUpperCase();

          result[hashKey] = tokens[token];
        }
      });

      return result;
    },
    {} as Record<string, TokenMetaBase>
  );
