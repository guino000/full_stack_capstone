import React from 'react';
import {useUser} from '@auth0/nextjs-auth0';
import {UISpacer} from "../components/UISpacer";
import {Container, Stack} from "@mui/material";

export default function Profile() {
  const {user} = useUser()
  // @ts-ignore
  return (
    (
      <>
        <UISpacer size={'big'}/>
        <Container>
          {user &&
            (
              <Stack alignItems={"center"}>
                <img src={user.picture || ''} alt={user?.name || ''}/>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{(user['http://demozero.net/roles'] as string[])}</p>
              </Stack>
            )
          }
        </Container>
      </>
    )
  );
}
