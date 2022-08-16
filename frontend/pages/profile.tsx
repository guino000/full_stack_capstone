import React from 'react';
import {useUser} from '@auth0/nextjs-auth0';
import {UISpacer} from "../components/UISpacer";
import Image from 'next/image'
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
                <Image src={user.picture || ''} alt={user?.name || ''}/>
                <h2>{user.name}</h2>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{(user['http://demozero.net/roles'] as string[])}</p>
                <p>{(user['http://demozero.net/oauth/token '] as string[])}</p>
              </Stack>
            )
          }
        </Container>
      </>
    )
  );
}
