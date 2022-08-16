import React from "react";
import {IDParam, Product} from "../../lib/products";
import {Card, CardContent, CardHeader, Container, Grid, Typography} from "@mui/material";
import axios from "axios";
import {srcset} from "../../lib/utils/srcset";
import {UISpacer} from "../../components/UISpacer";
import {GlobalConfig} from "../../lib/globalConfig";

export async function getServerSideProps({params}: IDParam) {
  try {
    const res = await axios.get(`${GlobalConfig.API.frontEndUrl}/api/productdetails/${params.id}`)
    const data = JSON.parse(res.data)
    return {
      props: {
        productData: data,
      },
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
}

export default function ProductDetailsPage({productData}: { productData: Product }) {
  return (
    <Container maxWidth={'lg'}>
      <UISpacer size={'big'}/>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <img
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
