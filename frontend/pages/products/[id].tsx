import React from "react";
import {IDParam, Product} from "../../lib/products";
import {Container} from "@mui/material";
import axios from "axios";

export async function getStaticPaths() {
  const res = await axios.get(`http://localhost:3000/api/products`)
  const products = JSON.parse(res.data)
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
  return {
    props: {
      productData: JSON.parse(res.data),
    },
  };
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
