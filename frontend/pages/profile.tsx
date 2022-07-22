import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {UISpacer} from "../components/UISpacer";
import {Box, Container} from "@mui/material";

export default withPageAuthRequired(function Profile({user}) {
  return (
    user && (
      <Container>
        <UISpacer size={'big'}/>
        <Box alignItems={"center"}>
          <img src={user.picture || ''} alt={user.name || ''}/>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </Box>
      </Container>
    )
  );
})
