import { Container } from "../../components/container";

export function Home() {
  return (
    <Container>
      <section className="bg-black p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Pesquise sobre algúm conteúdo"
        />
        <button
          className="bg-write-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="bg-write font-bold text-center mt-6 text-2xl mb-4">
        Conteúdos sobre universo e afins
      </h1>

      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


        <section className="w-full bg-white rounded-lg">
          <img
            className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
            src="https://t.ctcdn.com.br/vgdxANeoO9ZErxryOoKrqr2ggUo=/512x288/smart/filters:format(webp)/i718184.jpeg"
            alt="Carro" 
          />
          <p className="font-bold mt-1 mb-2 px-2">Buracos Negros</p>

          <div className="flex flex-col px-2">
            <span className="text-zinc-700 mb-6">Os buracos negros são...</span>
            <strong className="text-black font-medium text-xl"></strong>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="px-2 pb-2">
            <span className="text-black">
              Autor: Franklin Roza
            </span>
          </div>

        </section>


      </main>
    </Container>
  )
}
