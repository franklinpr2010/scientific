import { useEffect, useState, useContext  } from 'react'
import { Container } from "../../components/container";
import { DashboardHeader } from '../../components/panelheader'

import { FiTrash2 } from 'react-icons/fi'

import { collection, getDocs, where, query, doc, deleteDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'
import { ref, deleteObject } from 'firebase/storage'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'


interface ContentProps{
  id: string;
  titulo: string;
  autor: string;
  textmini: string;
  content: string;
  created: string;
  uid: string;
  images: ImageContentProps[];
}

interface ImageContentProps{
  name: string;
  uid: string;
  url: string
}

export function Dashboard() {
  const [contents, setContent] = useState<ContentProps[]>([]); 
  const { user } = useContext(AuthContext);

  useEffect(() => {

    function loadContent(){
      if(!user?.uid){
        return;
      }

      const contentsRef = collection(db, "contents")
      const queryRef = query(contentsRef, where("uid", "==", user.uid))

      getDocs(queryRef)
      .then((snapshot) => {
        let listcontent = [] as ContentProps[];

        snapshot.forEach( doc => {
        listcontent.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
            textmini: doc.data().textmini,
            content: doc.data().content,
            created: doc.data().created,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })
        console.log(listcontent)

        setContent(listcontent);  
        
      })

    }

    loadContent();

  }, [user])



  async function handleDeleteContent(content: ContentProps){
    const itemContent = content;

    const docRef = doc(db, "contents", itemContent.id)
    await deleteDoc(docRef);
    
    itemContent.images.map( async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`
      const imageRef = ref(storage, imagePath)

      try{
        await deleteObject(imageRef)
        setContent(contents.filter(content => content.id !== itemContent.id))
        toast.success("Conteúdo deletado com sucesso!")
      }catch(err){
        console.log("ERRO AO EXCLUIR ESSA IMAGEM")
      }

    })
  }


  return (
    <Container>
      <DashboardHeader/>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

      {contents.map( content => (
        <section key={content.id} className="w-full bg-white rounded-lg relative">
          <button 
          onClick={ () => handleDeleteContent(content) }
          className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
          >
            <FiTrash2 size={26} color="#000" />
          </button>

          <img
            className="w-full rounded-lg mb-2 max-h-70"
            src={content.images[0].url}
          />
          <p className="font-bold mt-1 px-2 mb-2">{content.titulo}</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700">
              {content.textmini}
            </span>
            <strong className="text-black font-bold mt-4">
              Autor(a): {content.autor}
            </strong>
          </div>

        </section>
      )) }

      </main>

    </Container>
  )
}