import Mint from './components/Mint';
import { Web3ModalProvider } from './connect';
import NftProvider from './contexts/NftContext';

function App() {
  return (
    <Web3ModalProvider>
      <NftProvider>
        <Mint />
      </NftProvider>
    </Web3ModalProvider>
  );
}

export default App;
