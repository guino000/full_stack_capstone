import {Product} from "../lib/products";
import React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ImageList from "@mui/material/ImageList";
import Typography from "@mui/material/Typography";
import {Container, Divider, Link, useMediaQuery, useTheme} from "@mui/material";
import {UISpacer} from "../components/UISpacer";
import axios from "axios";
import {srcset} from "../lib/utils/srcset";
import Flatted from "flatted";
import {getCircularReplacer} from "../lib/utils/getCircularReplacer";
import Image from 'next/image'

// @ts-ignore
export async function getStaticProps() {
  try {
    const allProducts = await axios.get('http://localhost:3000/api/products');
    const data = Flatted.parse(allProducts.data, getCircularReplacer)
    return {
      props: {
        productsData: data
      },
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
}

export default function Home({productsData}: { productsData: Product[] }) {
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
          {productsData.slice(0, bigScreen ? 3 : 2).map(p => (
            <Link key={"d1"} href={`/products/${p.id}`} color={'inherit'} underline="none">
              <ImageListItem>
                <Image
                  {...srcset(p.pictures[0]?.url, 250, 250)}
                  alt={p.name}
                  style={{height: 550, objectFit: 'cover', objectPosition: 'top'}}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={p.name}
                  subtitle={<span>R$ {p.cost} - {p.description}</span>}
                  position="below"
                />
              </ImageListItem>
            </Link>
          ))}
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
            <Link key={item.id} href={`/products/${item.id}`} color={'inherit'} underline="none">
              <ImageListItem>
                <Image
                  {...srcset(item.pictures[0]?.url, 250, 150)}
                  style={{height: 300, objectFit: 'cover', objectPosition: 'top'}}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  subtitle={<span>R$ {item.cost} - {item.description}</span>}
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
