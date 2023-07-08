import { useState, useEffect } from 'react'
import { Container } from "../../components/container";
import { Link } from 'react-router-dom'
import {
  collection,
  query,
  getDocs,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

interface ContentsProps{
  id: string;
  titulo: string;
  autor: string;
  textmini: string;
  content: string;
  uid: string;
  created: string;
  images: ContentImageProps[];
}

interface ContentImageProps{
  name: string;
  uid: string;
  url: string;
}


export function Home() {
  const [contents, setContents] = useState<ContentsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadContent();
  }, [])


  async function handleSearchContents(){
    if(input === ''){
      loadContent();
      return;
    }

    setContents([]);
    setLoadImages([]);

    const q = query(collection(db, "contents"), 
    where("titulo", ">=", input),
    where("titulo", "<=", input + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)

    let listcars = [] as ContentsProps[];

    querySnapshot.forEach((doc) => {
      listcars.push({
        id: doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor,
        textmini: doc.data().textmini,
        content: doc.data().content,
        created: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

   setContents(listcars);

  }


  function loadContent(){
    const contentRef = collection(db, "contents")
    const queryRef = query(contentRef, orderBy("created", "desc"))

    getDocs(queryRef)
    .then((snapshot) => {
      let listcontents = [] as ContentsProps[];

      snapshot.forEach( doc => {
        listcontents.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
          textmini: doc.data().textmini,
          content: doc.data().content,
          created: doc.data().price,
          images: doc.data().images,
          uid: doc.data().uid
        })
      })

      setContents(listcontents);  
    })

  }


  function handleImageLoad(id: string){
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }


  return (
    <Container>
      <section className="bg-black p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
      <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do conteúdo..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
          onClick={handleSearchContents}
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Conteúdo sobre o universo
      </h1>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


      {contents.map( content => (
        <Link key={content.id} to={`/content/${content.id}`}>
          <section className="w-full bg-white rounded-lg">
            <div 
            className="w-full h-72 rounded-lg bg-slate-200"
            style={{ display: loadImages.includes(content.id) ? "none" : "block" }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src={content.images[0].url}
              alt="Content" 
              onLoad={ () => handleImageLoad(content.id) }
              style={{ display: loadImages.includes(content.id) ? "block" : "none" }}
            />
	   
            <p className="font-bold mt-1 mb-2 px-2">{content.titulo}</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">{content.textmini}</span>
            <strong className="text-black font-medium text-xl"></strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="px-2 pb-2">
            <span className="text-black">
              Autor: {content.autor}
            </span>
          </div>

          </section>
        </Link>
      ))}


      </main>
    </Container>
  )
}
