import {deleteProduct, getAllProducts, Product} from "../lib/products";
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

// @ts-ignore
export async function getStaticProps(context) {
  const productsData = await getAllProducts();
  return {
    props: {
      productsData,
    },
  };
}

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

export default function Products({productsData}: { productsData: Product[] }) {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [deleted, setDeleted] = React.useState(false)
  const [products, setProducts] = React.useState<Product[]>(productsData)
  const onDelete = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
      const status = await deleteProduct(id.toString())
      const products = await getAllProducts()
      setProducts(products)
      setDeleted(status === 200)
    }, [])

  return (
    <>
      <UISpacer size={"big"}/>
      <Container maxWidth={"md"}>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Typography align={"center"}>
            Lista de Produtos
          </Typography>
          <IconButton aria-label="add" color={"success"} href={`/products/form`}>
            <AddCircleOutlineRoundedIcon/>
          </IconButton>
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
                <IconButton edge="end" aria-label="edit" href={`/products/form`}>
                  <EditIcon/>
                </IconButton>
                &nbsp;
                &nbsp;
                <IconButton edge="end" aria-label="delete" onClick={(e) => onDelete(e, item.id)}>
                  <DeleteIcon/>
                </IconButton>
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
}
