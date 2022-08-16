import {UISpacer} from "../../components/UISpacer";
import Typography from "@mui/material/Typography";
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
import React, {useCallback} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import {uniqForObject} from "../../lib/utils/uniqForObject";
import {LoadingButton} from '@mui/lab'
import axios from "axios";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import {GlobalConfig} from "../../lib/globalConfig";

export type Inputs = {
  name: string,
  description?: string,
  cost?: number,
  size?: string,
  pictureUrls?: string[]
}

export default withPageAuthRequired(function ProductCreate({user}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [pictures, setPictures] = React.useState<string[]>([])
  const [picture, setPicture] = React.useState<string>('')
  const {register, handleSubmit, reset} = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    try {
      setLoading(true)
      const res = await axios.post(`${GlobalConfig.API.frontEndUrl}/api/products/create`, {
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
    } catch (error) {
      setLoading(false)
      setError(true)
      setSuccess(false)
      reset()
    }
  }, [setLoading, pictures, reset])

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
        Criar Novo Produto
      </Typography>
      <UISpacer/>
      <Divider/>
      <UISpacer size={"big"}/>
      <Container maxWidth={'md'}>
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth required label="Nome" variant="filled" {...register("name")}/>
          <UISpacer/>
          <TextField fullWidth label="Descrição" variant="filled" {...register("description")}/>
          <UISpacer/>
          <TextField required label="Valor" type={"number"} variant="filled" {...register("cost")}/>
          <UISpacer/>
          <TextField label="Tamanho" type={"number"} variant="filled" {...register("size")}/>
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
            Erro! Não foi possível adicionar
          </Alert></>)}
          {success && (<><UISpacer/><UISpacer/><Alert severity="success">
            <AlertTitle>Sucesso</AlertTitle>
            Adicionado com sucesso!
          </Alert></>)}
          <UISpacer size={"big"}/>
          <LoadingButton
            type='submit'
            variant={"contained"}
            loading={loading}
            endIcon={<SendIcon/>}>
            Criar
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
})
