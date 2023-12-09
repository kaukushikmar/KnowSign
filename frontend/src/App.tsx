import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
// import { Greeter } from './components/Greeter';
import { SectionDivider } from './components/SectionDivider';
import { SignMessage } from './components/SignMessage';
import { WalletStatus } from './components/WalletStatus';
import './app.css';
import axios from 'axios';
 

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;



const URL = `https://api.tenderly.co/api/v1/account/labs_orbit/project/abcd/simulate`
const CONTRACT_ADD = "0xf35101b37928bb044ff5339bc6ff816b68bd5c43";

export const simulateTransaction = async (from: any, to: any, input: any, value: any) => {
    // const unsignedTx = await contract.populateTransaction[funcName](...args)

  // const apiURL = URL;
  const body = {
      "simulation_type": 'full',
        "network_id": "137",
        "from": `${from}`, // '0x86b96242f84FF0Cb3f1A85E265Ee6cD0473ff5d9',
        "to": `${to}`, //'0xB68F4bf1DE257182157fCa57f961F53CEb4D5066',
        "input": `${input}`, //'0x',
        "gas": 100000000,
        "gas_price": "0",
        "value": `${value}`,
    	"save_if_fails": true
    }

    const headers = {
        headers: {
            'content-type': 'application/JSON',
            'X-Access-Key': '19UjFxWmi9u19J1IrgtUM8dorlyhScWx',
      }
    }
    const resp = await axios.post(URL, body, headers);
    // console.log("🚀 ~ file: App.tsx:43 ~ simulateTransaction ~ resp:", resp)

    return resp
}

const TokenCard = ({ token }: any) => {
  return (
    <div className="token-card">
      <div className="token-image">
        <img src={token.token_info.logo} alt={token.token_info.name} />
      </div>
      <div className="token-info">
        <h3>{token.token_info.name} ({token.token_info.symbol})</h3>
        <p><strong>Amount:</strong> {token.amount}</p>
        <p><strong>Dollar Value:</strong> ${token.dollar_value}</p>
        <p><strong>From:</strong> {token.from}</p>
        <p><strong>To:</strong> {token.to}</p>
        <p><strong>Type:</strong> {token.type}</p>
        <p><strong>Raw Amount:</strong> {token.raw_amount}</p>
      </div>
    </div>
  );
};

const TokenList = ({ tokenArray }: any) => {
  return (
    <div className="token-list">
      {tokenArray.map((token: any, index: any) => (
        <TokenCard key={index} token={token} />
      ))}
    </div>
  );
};

export function App(): ReactElement {

    const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [inputData, setInputData] = useState('');
  const [value, setValue] = useState('');
  const [tokenArray, setTokenArray] = useState([]);
  
  // useEffect(() => {
  // async function fetchData() {
  //   const resp = await simulateTransaction();
  //   setTokenArray(resp.data!.transaction?.transaction_info.asset_changes);
  // }
  // fetchData();
  // }, []);
  
  useEffect(() => {
    console.log('tokenArray', tokenArray)
  }, [tokenArray])
  
  const handleSubmit = async (event: any) => {
  event.preventDefault();
  const response = await simulateTransaction(fromAddress, toAddress, inputData, value);
  setTokenArray(response.data!.transaction?.transaction_info.asset_changes);
};

  return (
    <StyledAppDiv>
      {/* <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <SignMessage /> */}
      <SectionDivider />
      <form onSubmit={handleSubmit}>
  <input
    type="text"
    value={fromAddress}
    onChange={(e) => setFromAddress(e.target.value)}
    placeholder="From Address"
  />
  <input
    type="text"
    value={toAddress}
    onChange={(e) => setToAddress(e.target.value)}
    placeholder="To Address"
  />
  <input
    type="text"
    value={inputData}
    onChange={(e) => setInputData(e.target.value)}
    placeholder="Input Data"
  />
  <input
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Input Data"
  />
  <button type="submit">Simulate Transaction</button>
      </form>
            <SectionDivider />
      {/* <Greeter /> */}
      <TokenList tokenArray={tokenArray}/>
    </StyledAppDiv>
  );
}
