import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import { getDoc, doc, } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { Swiper, SwiperSlide } from 'swiper/react'

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
  uid: string;
  name: string;
  url: string;
}

export function Contents() {
  const { id } = useParams(); 
  const [content, setContent] = useState<ContentProps>()
  const [sliderPerView, setSliderPerView] = useState<number>(2);
  const navigate = useNavigate();


  useEffect(() => {
    async function loadContent(){
      if(!id){ return }

      const docRef = doc(db, "contents", id)
      getDoc(docRef)
      .then((snapshot) => {

        if(!snapshot.data()){
          navigate("/")
        }

        setContent({
          id: snapshot.id,
          titulo: snapshot.data()?.titulo,
          autor: snapshot.data()?.autor,
          textmini: snapshot.data()?.textmini,
          content: snapshot.data()?.content,
          created: snapshot.data()?.created,
          uid: snapshot.data()?.uid,
          images: snapshot.data()?.images
        })
      })


    }

    loadContent()


  }, [id])


  useEffect(() => {

    function handleResize(){
      if(window.innerWidth < 720){
        setSliderPerView(1);
      }else{
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize)

    return() => {
      window.removeEventListener("resize", handleResize)
    }

  }, [])


  return (
    <Container>
      
      { content && (
        <Swiper
          slidesPerView={sliderPerView}
          pagination={{ clickable: true }}
          navigation
        >
          {content?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img
                src={image.url}
                className="w-full h-96 object-cover"
              />
            </SwiperSlide>
          ))} 
        </Swiper>
      )}

      { content && (
      <main className="w-full bg-black rounded-lg p-6 my-4">
        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
          <h1 className="font-bold text-3xl text-white">{content?.titulo}</h1>
        </div>
        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
             <p className="mb-4 text-white">{content?.content}</p>
        </div>
        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
            <p className="mb-4 text-white">{content?.autor}</p>
        </div>

      </main>
      )}
    </Container>
  )
}