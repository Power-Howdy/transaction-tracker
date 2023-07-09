import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';

function App() {
  const [account, setAccount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/2c6f59a6ad79413da35223b08d44a5e7');
    const getTransactions = async () => {
      try {
        const txs = await provider.getHistory(account);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (account) {
      getTransactions();
    }
  }, [account]);

  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  return (
    <Router>
      <Container>
        <h1 className="mt-4">Transaction Tracker</h1>
        <Form>
          <Form.Group controlId="formAccount">
            <Form.Label>Enter Ethereum account</Form.Label>
            <Form.Control type="text" placeholder="Account" onChange={handleAccountChange} />
          </Form.Group>
        </Form>
        <Switch>
          <Route exact path="/">
            <TransactionList transactions={transactions} />
          </Route>
          <Route path="/transaction/:id">
            <TransactionDetails transactions={transactions} />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

function TransactionList({ transactions }) {
  return (
    <div>
      <h2 className="mt-4">Transaction List</h2>
      <ListGroup>
        {transactions.map((tx) => (
          <ListGroup.Item key={tx.hash}>
            <Link to={`/transaction/${tx.hash}`}>{tx.hash}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

function TransactionDetails({ transactions }) {
  const transactionId = window.location.pathname.split('/').pop();
  const transaction = transactions.find((tx) => tx.hash === transactionId);

  return (
    <div>
      <h2 className="mt-4">Transaction Details</h2>
      {transaction ? (
        <div>
          <p>Hash: {transaction.hash}</p>
          <p>From: {transaction.from}</p>
          <p>To: {transaction.to}</p>
          <p>Value: {ethers.utils.formatEther(transaction.value)}</p>
        </div>
      ) : (
        <p>Transaction not found.</p>
      )}
    </div>
  );
}

export default App;