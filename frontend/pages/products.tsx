import {getAllProducts, Product} from "../lib/products";
import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ImageList from "@mui/material/ImageList";
import Typography from "@mui/material/Typography";
import {Container, Divider, Link, useMediaQuery, useTheme} from "@mui/material";
import {UISpacer} from "../components/UISpacer";

export async function getStaticProps() {
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


export default function Products({productsData}: { productsData: Product[] }) {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <>
      <UISpacer size={"big"}/>
      <Typography align={"center"}>
        Destaques
      </Typography>
      <UISpacer/>
      <Divider/>
      <Container>
        <ImageList gap={1} cols={bigScreen ? 3 : 2}>
          <ImageListItem key={"d1"}>
            <img
              {...srcset('https://img.xcitefun.net/users/2012/05/294731,xcitefun-a98185-catinpjs.jpg', 250, 250)}
              alt={'Destaque 1'}
              loading="lazy"
            />
            <ImageListItemBar
              title={'Destaque 1'}
              subtitle={<span>{'Destaque 1'}</span>}
              position="below"
            />
          </ImageListItem>
          <ImageListItem key={"d2"}>
            <img
              {...srcset('https://cdn.acidcow.com/content/img/new03/80/31.jpg', 250, 250)}
              alt={'Destaque 2'}
              loading="lazy"
            />
            <ImageListItemBar
              title={'Destaque 2'}
              subtitle={<span>{'Destaque 2'}</span>}
              position="below"
            />
          </ImageListItem>
          <ImageListItem key={"d3"} sx={{
            display: {xs: 'none', md: 'flex'}
          }}>
            <img
              {...srcset('https://cdn.acidcow.com/content/img/new03/80/30.jpg', 250, 250)}
              alt={'Destaque 3'}
              loading="lazy"
            />
            <ImageListItemBar
              title={'Destaque 3'}
              subtitle={<span>{'Destaque 3'}</span>}
              position="below"
            />
          </ImageListItem>
        </ImageList>
      </Container>
      <UISpacer size={"big"}/>
      <Typography align={"center"}>
        Postagens Recentes
      </Typography>
      <UISpacer/>
      <Divider/>
      <Container>
        <ImageList gap={16} cols={bigScreen ? 4 : 2}>
          {productsData.slice(0, 12).map((item) => (
            <Link href={`/products/${item.id}`} color={'inherit'} underline="none">
              <ImageListItem key={item.id}>
                <img
                  {...srcset('https://alittlecraftinyourday.com/wp-content/uploads/2016/11/IMG_9954.jpg', 250, 250)}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  subtitle={<span>{item.description}</span>}
                  position="below"
                />
              </ImageListItem>
            </Link>
          ))}
        </ImageList>
      </Container>
    </>
  )
}
