import {Product} from "../lib/products";
import React, {useCallback} from "react";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Container,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {UISpacer} from "../components/UISpacer";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {useUser, withPageAuthRequired} from "@auth0/nextjs-auth0";
import axios from "axios";
import Flatted from "flatted";

// @ts-ignore
export async function getStaticProps() {
  const res = await axios.get(`http://localhost:3000/api/products`)
  return {
    props: {
      productsData: Flatted.parse(res.data),
    },
  };
}

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

export default withPageAuthRequired(function Products({productsData}: { productsData: Product[] }) {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [deleted, setDeleted] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>(productsData)
  const {user} = useUser()
  const roles = (user ? (user['http://demozero.net/roles'] as string[]) : []).map(r => r.toLowerCase())

  const onDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
      try {
        const res = await axios.delete(`http://localhost:3000/api/products/${id}`)
        const productsRes = await axios.get(`http://localhost:3000/api/products`)
        setProducts(Flatted.parse(productsRes.data))
        setDeleted(res.status === 200)
      } catch (error) {
        console.log(error)
      }
    }, [setProducts, setDeleted])

  return (
    <>
      <UISpacer size={"big"}/>
      <Container maxWidth={"md"}>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Typography align={"center"}>
            Lista de Produtos
          </Typography>
          {roles.includes('manager') &&
            (<IconButton aria-label="add" color={"success"} href={`/products/form`}>
              <AddCircleOutlineRoundedIcon/>
            </IconButton>)}
        </Stack>
      </Container>
      <UISpacer/>
      <Container maxWidth={"md"}>
        <Divider/>
        <List>
          {products.map((item) => (
            <ListItem
              key={item.id}
              divider={true}
              secondaryAction={<>
                <IconButton edge="end" aria-label="edit" href={`/products/update/${item.id}`}>
                  <EditIcon/>
                </IconButton>
                {roles.includes('manager') && (<>
                    &nbsp;
                    &nbsp;
                    <IconButton edge="end" aria-label="delete" onClick={(e) => onDelete(e, item.id)}>
                      <DeleteIcon/>
                    </IconButton>
                  </>
                )}
              </>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <img src={item.pictures[0]?.url} alt={item.name}/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={item.description}
              />
            </ListItem>
          ))}
        </List>
        {
          !bigScreen &&
            <Fab color="primary" aria-label="add" sx={fabStyle}>
                <AddIcon/>
            </Fab>
        }
      </Container>
    </>
  )
})
