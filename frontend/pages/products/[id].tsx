import React from "react";
import {getAllProductIds, getProduct, IDParam, Product} from "../../lib/products";
import {Container} from "@mui/material";

export async function getStaticPaths() {
  const paths = await getAllProductIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({params}: IDParam) {
  const productData = await getProduct(params.id)
  return {
    props: {
      productData
    }
  }
}

export default function ProductDetailsPage({productData}: { productData: Product }) {
  return (
    <Container>
      <p>{productData.id}</p>
      <p>{productData.name}</p>
      <p>{productData.description}</p>
      <p>{productData.cost}</p>
      <p>{productData.size}</p>
    </Container>
  )

}
