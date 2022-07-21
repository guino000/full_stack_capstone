import {UISpacer} from "../../components/UISpacer";
import Typography from "@mui/material/Typography";
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
import React, {ChangeEvent, useCallback} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import {uniqForObject} from "../../lib/utils/uniqForObject";
import {LoadingButton} from '@mui/lab'
import {createProduct} from "../../lib/products";
import {useRouter} from "next/router";

type Inputs = {
  name: string,
  description?: string,
  cost?: number,
  size?: string,
  pictureUrls?: string[]
}

export default function ProductForm() {
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
    const res = await createProduct({
      ...data,
      pictures: pictures
    })
    setLoading(false)
    if (res === 200) {
      setSuccess(true)
    } else {
      setError(true)
    }
    reset()
  }, [setLoading, pictures])

  const onPictureChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPictures(uniqForObject([...pictures, e.target.value]))
    setPicture('')
  }, [pictures, setPictures, setPicture])

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
          <TextField fullWidth required label="Name" variant="filled" {...register("name")}/>
          <UISpacer/>
          <TextField fullWidth label="Description" variant="filled" {...register("description")}/>
          <UISpacer/>
          <TextField fullWidth required label="Cost" variant="filled" {...register("cost")}/>
          <UISpacer/>
          <TextField fullWidth label="Size" variant="filled" {...register("size")}/>
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
            Criar
          </LoadingButton>
        </Box>
      </Container>
    </Box>
  )
}
