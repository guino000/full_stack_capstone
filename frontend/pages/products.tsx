import Link from "next/link";
import Head from "next/head";
import layout from '../components/layout'
import Layout from "../components/layout";
import {getAllProducts} from "../lib/products";

export async function getStaticProps() {
    const productsData = await getAllProducts();
    return {
        props: {
            productsData,
        },
    };
}

export default function Products({productsData}) {
    return (<Layout>
        <Head>
            <title>Product List</title>
        </Head>

        <body>
        {productsData.products.map((p) => {return (
            <p>
            <Link href={`/products/${p.id}`}>
                <a>{p['name']}</a>
            </Link>
            </p>
            )})}
            <h2>
                <Link href={'/'}>
                    <a>Back to Home</a>
                </Link>
            </h2>
        </body>
    </Layout>)
}
