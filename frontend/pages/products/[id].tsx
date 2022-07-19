import Layout from "../../components/layout";
import {getAllProductIds, getProduct} from "../../lib/products";

export async function getStaticPaths() {
    const paths = await getAllProductIds()
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}){
    const productData = await getProduct(params.id)
    return {
        props: {
            productData
        }
    }
}

export default function Product({productData}){
    return (<Layout>
        <p>{productData['id']}</p>
        <p>{productData['name']}</p>
        <p>{productData['description']}</p>
        <p>{productData['cost']}</p>
        <p>{productData['size']}</p>
    </Layout>)

}
