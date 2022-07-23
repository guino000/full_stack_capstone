import React from "react";
import {IDParam, Product} from "../../lib/products";
import {Card, CardContent, CardHeader, Container, Grid, Typography} from "@mui/material";
import axios from "axios";
import {srcset} from "../../lib/utils/srcset";
import {UISpacer} from "../../components/UISpacer";
import Flatted from "flatted";
import {getCircularReplacer} from "../../lib/utils/getCircularReplacer";
import Image from 'next/image'

export async function getStaticPaths() {
  const res = await axios.get(`http://localhost:3000/api/products`)
  const products = Flatted.parse(res.data, getCircularReplacer)
  const paths = products.map((p: Product) => {
    return {params: {id: p.id.toString()}}
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({params}: IDParam) {
  const res = await axios.get(`http://localhost:3000/api/productdetails/${params.id}`)
  const data = Flatted.parse(res.data)
  return {
    props: {
      productData: data,
    },
  };
}

export default function ProductDetailsPage({productData}: { productData: Product }) {
  return (
    <Container maxWidth={'lg'}>
      <UISpacer size={'big'}/>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Image
            {...srcset(productData.pictures[0]?.url, 250, 250)}
            alt={productData.name}
            style={{height: 550, objectFit: 'cover', objectPosition: 'top'}}
          />
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader title={productData.name}/>
            <CardContent>
              <Typography variant={"body1"}>{productData.description}</Typography>
              <UISpacer/>
              <Typography variant={"caption"}>Tamanho: {productData.size}</Typography>
              <UISpacer/>
              <Typography variant={"caption"}>R$ {productData.cost}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )

}
