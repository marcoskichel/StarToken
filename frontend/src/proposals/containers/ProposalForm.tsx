import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { StarTokenContext } from '../../hardhat/SymfoniContext';

type Props = {};

export function ProposalForm(props: Props) {
  const starToken = useContext(StarTokenContext);

  const handleClick = async () => {
    const totalSupply = await starToken.instance?.totalSupply();
    alert(totalSupply);
  };

  return (
    <div>
      <h1>Welcome</h1>
      <Button onClick={handleClick}>Print total supply</Button>
    </div>
  );
}
