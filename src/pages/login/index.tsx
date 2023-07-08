import logoImg from '../../assets/universe.png'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '../../components/container'
import {useEffect} from 'react';

import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

import {auth} from '../../services/firebaseConnection';

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut} from 'firebase/auth'

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })


  useEffect(() => {
    async function handleLogout() {
        await signOut(auth);
    }
  },[])


  function onSubmit(data: FormData){
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((user) => {
        console.log(data);
        console.log(user);
        navigate("/dashboard", {replace: true});
    })
    .catch(err => {
        console.log("Erro ao logar no sistema!");
        console.log(err);
    })
    
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img
            src={logoImg}
            alt="Logo do site"
            className="w-full"
          />
        </Link>

        <form 
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button type="submit" className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">
            Acessar
          </button>

        </form>

        <Link to="/register">
          <p className='text-white'>Ainda não possui uma conta? Cadastre-se</p>
        </Link>

      </div>
    </Container>
  )
}