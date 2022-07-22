import React, {ChangeEvent, useCallback} from "react";
import {IDParam, Product} from "../../../lib/products";
import {
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import axios from "axios";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import {useRouter} from "next/router";
import {SubmitHandler, useForm} from "react-hook-form";
import {Inputs} from "../form";
import {uniqForObject} from "../../../lib/utils/uniqForObject";
import {UISpacer} from "../../../components/UISpacer";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import {LoadingButton} from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";

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

export default withPageAuthRequired(function ProductUpdate({productData}: { productData: Product }) {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const router = useRouter()
  console.log(router.query);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [pictures, setPictures] = React.useState<string[]>(productData?.pictures?.map(p => p.url) || [])
  const [picture, setPicture] = React.useState<string>('')
  const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    setLoading(true)
    console.log(data)
    try {
      const res = await axios.patch(`http://localhost:3000/api/products/${productData.id}`, {
        ...data,
        pictures: pictures
      })
      setLoading(false)
      if (res.status === 200) {
        setSuccess(true)
      } else {
        setError(true)
      }
      reset()
    } catch (error) {
      setLoading(false)
      setError(true)
      reset()
    }
  }, [setLoading, pictures])

  const onPictureChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPictures(uniqForObject([...pictures, e.target.value]))
    setPicture('')
  }, [pictures, setPictures, setPicture])

  const onDeletePicture = useCallback((pic: string) => {
    pictures.splice(pictures.indexOf(pic), 1)
    setPictures([...pictures])
  }, [pictures, setPictures])

  return (
    <Box>
      <UISpacer size={"big"}/>
      <Typography variant={"h3"} align={"center"}>
        Editar Produto {productData?.id}
      </Typography>
      <UISpacer/>
      <Divider/>
      <UISpacer size={"big"}/>
      <Container maxWidth={'md'}>
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth required label="Name" defaultValue={productData?.name}
                     variant="filled" {...register("name")}/>
          <UISpacer/>
          <TextField fullWidth label="Description" defaultValue={productData?.description}
                     variant="filled" {...register("description")}/>
          <UISpacer/>
          <TextField fullWidth required label="Cost" defaultValue={productData?.cost}
                     variant="filled" {...register("cost")}/>
          <UISpacer/>
          <TextField fullWidth label="Size" defaultValue={productData?.size} variant="filled" {...register("size")}/>
          <UISpacer/>
          <Typography>
            Adicionar Foto
          </Typography>
          <UISpacer size="small"/>
          <input id={"picture-input"} value={picture} type="file" accept="image/*;capture=camera"
                 onChange={(e) => onPictureChange(e)}/>
          <UISpacer/>
          <List>
            {pictures.map((item) => (
              <ListItem
                key={item}
                divider={true}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e) => onDeletePicture(item)}>
                    <DeleteIcon/>
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item}
                />
              </ListItem>
            ))}
          </List>
          <UISpacer size={"big"}/>
          <LoadingButton
            type='submit'
            variant={"contained"}
            loading={loading}
            endIcon={<SendIcon/>}>
            Atualizar
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
})
