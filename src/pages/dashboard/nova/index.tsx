import { ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";

import { FiUpload, FiTrash } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../../context/AuthContext'
import { v4 as uuidV4 } from 'uuid'

import { storage, db  } from '../../../services/firebaseConnection'
import toast from 'react-hot-toast'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore'

const schema = z.object({
  titulo: z.string().nonempty("O campo título é obrigatório"),
  textmini: z.string().nonempty("O Minitexto é obrigatório"),
  autor: z.string().nonempty("O Autor é obrigatório"),
  content: z.string().nonempty("O Conteúdo é obrigatório"),

})

type FormData = z.infer<typeof schema>;


interface ImageItemProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function Nova() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [contentImages, setContentImages] = useState<ImageItemProps[]>([])


  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        await handleUpload(image)
      }else{
        alert("Envie uma imagem jpeg ou png!")
        return;
      }


    }
  }
  
  
  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

    uploadBytes(uploadRef, image)
    .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem = {
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          }

          setContentImages((images) => [...images, imageItem] )
          toast.success("Imagem cadastrada com sucesso!")

        })
    })

  }

  function onSubmit(data: FormData){

    if(contentImages.length === 0){
      alert("Envie alguma imagem deste conteúdo!")
      return;
    }
    
    const contentListImages = contentImages.map( content => {
      return{
        uid: content.uid,
        name: content.name,
        url: content.url
      }
    })

    addDoc(collection(db, "contents"), {
      titulo: data.titulo,
      autor: data.autor,
      textmini: data.textmini,
      content: data.content,
      created: new Date(),
      images: contentListImages,
      uid: user?.uid
    })
    .then(() => {
      reset();
      setContentImages([]);
      toast.success("Conteúdo cadastrado com sucesso!")
      console.log("CADASTRADO COM SUCESSO!");
    })
    .catch((error) => {
      console.log(error)
      console.log("ERRO AO CADASTRAR NO BANCO")
    })

    
  }
  async function handleDeleteImage(item: ImageItemProps){
    const imagePath = `images/${item.uid}/${item.name}`;

    const imageRef = ref(storage, imagePath);

    try{
      await deleteObject(imageRef)
      setContentImages(contentImages.filter((contnt) => contnt.url !== item.url))
    }catch(err){
      console.log("ERRO AO DELETAR")
    }



  }
  return (
    <Container>
      <DashboardHeader/>
	
      <div className="flex sm:flex-row">
      <div className="w-full bg-black p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}  
        >
          <div className="mb-3">
            <p className="mb-2 text-white font-medium">Título</p>
            <Input
              type="text"
              register={register}
              name="titulo"
              error={errors.titulo?.message}
              placeholder="Escreva o título do conteúdo"
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 text-white font-medium">Mini Conteúdo</p>
            <Input
              type="text"
              register={register}
              name="textmini"
              error={errors.textmini?.message}
              placeholder="Uma breve descrição do conteúdo"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 text-white font-medium">Autor</p>
            <Input
              type="text"
              register={register}
              name="autor"
              error={errors.autor?.message}
              placeholder="Digito o autor do conteúdo"
            />
          </div>
          <div className="mb-3">
            <p className="mb-2 text-white font-medium">Conteúdo</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("content")}
              name="content"
              id="content"
              placeholder="Digite o conteúdo sobre o conteúdo..."
            />
            {errors.content && <p className="mb-1 text-red-500">{errors.content.message}</p>}
          </div>
          <button type="submit"  className="bg-red-500 w-full rounded-md mt-7  bg-zinc-900 text-white font-medium h-10">
            Cadastrar
          </button>
          
    </form>
    </div>
    <div className="w-full bg-black p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-white-600 h-32 md:w-48">
          <div className="absolute bg-white cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="opacity-0 cursor-pointer" 
              onChange={handleFile} 
            />
          </div>
        </button>

        {contentImages.map( item => (
          <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
            <button className="absolute" onClick={() => handleDeleteImage(item) }>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover"
              alt="Foto do Conteúdo"
            />
          </div>
        ))}
      </div>
      </div>
    </Container>
  )
}