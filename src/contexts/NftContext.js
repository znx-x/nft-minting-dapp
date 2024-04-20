import { createContext, useContext } from 'react';
import { useCollectionState } from '../hooks/useCollectionState';

export const NftContext = createContext();

export const useNftData = () => {
  return useContext(NftContext);
};

const NftProvider = ({ children }) => {
  const blockData = useCollectionState();

  return (
    <NftContext.Provider value={{ ...blockData }}>
      {children}
    </NftContext.Provider>
  );
};

export default NftProvider;
