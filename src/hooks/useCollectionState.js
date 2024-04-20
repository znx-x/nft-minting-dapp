import { useMemo } from 'react';
import { nftContract } from '../constants';
import { useBlockNumber, useReadContract } from 'wagmi';

export const useCollectionState = () => {
  const { data: blockNumber } = useBlockNumber({
    cacheTime: 4_000,
    watch: true,
  });

  const { data: _totalSupply } = useReadContract({
    ...nftContract,
    functionName: 'nextTokenId',
    blockNumber,
  });

  const { data: _MAX_SUPPLY } = useReadContract({
    ...nftContract,
    functionName: 'MAX_MINT',
  });

  return useMemo(() => {
    const MAX_SUPPLY = Number(_MAX_SUPPLY ?? 0);
    const totalSupply = Number(_totalSupply ?? 0);

    const isEnded =
      totalSupply > 0 && MAX_SUPPLY > 0 && totalSupply >= MAX_SUPPLY;
    return {
      totalSupply: Number(totalSupply),
      MAX_SUPPLY: Number(MAX_SUPPLY),
      isEnded,
    };
  }, [_totalSupply, _MAX_SUPPLY]);
};
