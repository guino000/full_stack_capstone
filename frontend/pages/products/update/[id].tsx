import React, {useCallback} from "react";
import {IDParam, Product} from "../../../lib/products";
import {
  Alert,
  AlertTitle,
  Box,
  Container,
  Divider,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField
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
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import Flatted from "flatted";
import {getCircularReplacer} from "../../../lib/utils/getCircularReplacer";

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
  const data = Flatted.parse(res.data, getCircularReplacer)
  return {
    props: {
      productData: data,
    },
  };
}

export default withPageAuthRequired(function ProductUpdate({productData}: { productData: Product }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [pictures, setPictures] = React.useState<string[]>(productData?.pictures?.map(p => p.url) || [])
  const [picture, setPicture] = React.useState<string>('')
  const {register, handleSubmit, reset} = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    setLoading(true)
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
      setPictures([])
      await router.push('/')
    } catch (error) {
      setLoading(false)
      setError(true)
      setSuccess(false)
    }
  }, [setLoading, pictures])

  const addPicture = useCallback(() => {
    setPictures(uniqForObject([...pictures, picture]))
    setPicture('')
  }, [picture, pictures, setPictures, setPicture])

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
          <TextField fullWidth required label="Cost" type={"number"} defaultValue={productData?.cost}
                     variant="filled" {...register("cost")}/>
          <UISpacer/>
          <TextField fullWidth label="Size" type={"number"} defaultValue={productData?.size}
                     variant="filled" {...register("size")}/>
          <UISpacer/>
          <FormControl fullWidth variant={'filled'}>
            <InputLabel htmlFor={'picture-input'}>
              Adicionar URL de Foto
            </InputLabel>
            <FilledInput
              id={"picture-input"}
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="add picture"
                    onClick={() => addPicture()}
                    disabled={picture === ''}
                    edge="end"
                  >
                    <AddCircleOutlineRoundedIcon/>
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <UISpacer/>
          <List>
            {pictures.map((item) => (
              <ListItem
                key={item}
                divider={true}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => onDeletePicture(item)}>
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
          {error && (<><UISpacer/><Alert severity="error">
            <AlertTitle>Erro</AlertTitle>
            Erro! Não foi possível atualizar
          </Alert></>)}
          {success && (<><UISpacer/><UISpacer/><Alert severity="success">
            <AlertTitle>Sucesso</AlertTitle>
            Atualizado com sucesso!
          </Alert></>)}
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
