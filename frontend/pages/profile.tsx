import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {UISpacer} from "../components/UISpacer";
import {Container, Stack} from "@mui/material";

export default withPageAuthRequired(function Profile({user}) {
  return (
    user && (
      <>
        <UISpacer size={'big'}/>
        <Container>
          <Stack alignItems={"center"}>
            <img src={user.picture || ''} alt={user.name || ''}/>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </Stack>
        </Container>
      </>
    )
  );
})
