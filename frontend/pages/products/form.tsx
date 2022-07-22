import {UISpacer} from "../../components/UISpacer";
import Typography from "@mui/material/Typography";
import {
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
  TextField,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, {useCallback} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import {uniqForObject} from "../../lib/utils/uniqForObject";
import {LoadingButton} from '@mui/lab'
import {useRouter} from "next/router";
import axios from "axios";
import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

export type Inputs = {
  name: string,
  description?: string,
  cost?: number,
  size?: string,
  pictureUrls?: string[]
}

export default withPageAuthRequired(function ProductCreate() {
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const router = useRouter()
  console.log(router.query);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [pictures, setPictures] = React.useState<string[]>([])
  const [picture, setPicture] = React.useState<string>('')
  const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    setLoading(true)
    console.log(data)
    try {
      const res = await axios.post('http://localhost:3000/api/products/create', {
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

  const addPicture = useCallback(() => {
    setPictures(uniqForObject([...pictures, picture]))
    setPicture('')
  }, [picture, pictures, setPictures, setPicture])

  const onDeletePicture = useCallback((pic: string) => {
    pictures.splice(pictures.indexOf(pic), 1)
    setPictures([...pictures])
  }, [pictures, setPictures])

  //TODO: Upload images to cloud storage

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
          <TextField required label="Valor" variant="filled" {...register("cost")}/>
          <UISpacer/>
          <TextField label="Tamanho" variant="filled" {...register("size")}/>
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
                    onClick={(e) => addPicture()}
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
            Criar
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
})
