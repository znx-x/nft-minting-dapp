import React, { useState } from 'react';
import * as s from '../../styles/globalStyles';
import {
  ResponsiveWrapper,
  StyledButton,
  StyledImg,
  StyledLink,
  StyledLogo,
  StyledRoundButton,
} from '../../styles/componentStyles';
import { useNftData } from '../../contexts/NftContext';
import config from '../../constants/config';
import { useAccount, useWriteContract } from 'wagmi';
import { nftContract } from '../../constants';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function Mint() {
  const { totalSupply, MAX_SUPPLY, isEnded } = useNftData();
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);

  const { isDisconnected, chainId } = useAccount();
  const { open } = useWeb3Modal();

  const { writeContractAsync } = useWriteContract();

  const claimNFTs = () => {
    try {
      console.log('here');
      let cost = config.WEI_COST;
      //   let gasLimit = config.GAS_LIMIT;
      let totalCostWei = String(cost * mintAmount);
      setFeedback(`Minting your ${config.NFT_NAME}...`);
      setClaimingNft(true);
      writeContractAsync({
        ...nftContract,
        functionName: 'mint',
        args: [mintAmount],
        value: Number(totalCostWei).toLocaleString('fullwide', {
          useGrouping: false,
        }),
      })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(
            `WOW, the ${config.NFT_NAME} is yours! go visit Xenwave to view it.`
          );
          setClaimingNft(false);
        })
        .catch((err) => {
          console.log(err);
          setFeedback(
            err?.shortMessage ??
              'Sorry, something went wrong please try again later.'
          );
          setClaimingNft(false);
        });
    } catch (err) {
      console.log(err);
      setFeedback(
        err?.shortMesage ??
          'Sorry, something went wrong please try again later.'
      );
      setClaimingNft(false);
    }
  };
  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={'center'}
        style={{ padding: 24, backgroundColor: '#000' }}
        image={config.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
      >
        <s.SpacerSmall />
        <s.SpacerSmall />
        <StyledLogo
          alt={'logo'}
          src={'/config/images/logo.png'}
          style={{
            width: '500px',
            maxWidth: '90vw',
          }}
        />
        <p style={{ color: '#FFF', fontSize: '14pt' }}>
          <b>Founders Edition</b>
        </p>
        <ResponsiveWrapper flex={1} style={{ margin: '20px' }} test>
          <s.Container flex={1} jc={'center'} ai={'center'}>
            <StyledImg alt={'example'} src={'/config/images/example.gif'} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={'center'}
            ai={'center'}
            style={{
              backgroundColor: 'rgba(2,2,2,0.85)',
              padding: 24,
              borderRadius: 24,
              border: '4px #000',
              boxShadow: '0px 5px 11px 2px rgba(0,0,0,0.7)',
            }}
          >
            <s.TextTitle
              style={{
                textAlign: 'center',
                fontSize: 50,
                fontWeight: 'bold',
                color: 'var(--accent-text)',
              }}
            >
              {totalSupply?.toString() ?? 0} / {MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--primary-text)',
              }}
            >
              <StyledLink target={'_blank'} href={config.SCAN_LINK}>
                {truncate(config.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {isEnded ? (
              <>
                <s.TextTitle
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  You can still find {config.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={'_blank'} href={config.MARKETPLACE_LINK}>
                  {config.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  Minting Cost: {config.DISPLAY_COST} {config.NETWORK.SYMBOL}
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {isDisconnected || chainId !== config.NETWORK.ID ? (
                  <s.Container ai={'center'} jc={'center'}>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}
                    >
                      Connect to {config.NETWORK.NAME} to continue.
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        open();
                      }}
                    >
                      Connect
                    </StyledButton>
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={'center'} jc={'center'} fd={'row'}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: 'center',
                          color: 'var(--accent-text)',
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={'center'} jc={'center'} fd={'row'}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                        }}
                      >
                        {claimingNft ? 'Working...' : 'Mint NFT'}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={'center'} ai={'center'}>
            <StyledImg
              alt={'example'}
              src={'/config/images/example.gif'}
              style={{ transform: 'scaleX(-1)' }}
              width='64'
              height='auto'
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={'center'} ai={'center'} style={{ width: '70%' }}>
          <s.TextDescription
            style={{
              textAlign: 'center',
              color: '#FFF',
              fontSize: '9pt',
            }}
          >
            Make sure you are connected to the correct network (
            {config.NETWORK.NAME}) and the correct wallet. Once you click on
            mint NFT, the action cannot be undone.
          </s.TextDescription>

          <s.TextDescription
            style={{
              textAlign: 'center',
              color: '#FFF',
              fontSize: '9pt',
            }}
          >
            We have set the gas limit to {config.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend you not to change it.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default Mint;
