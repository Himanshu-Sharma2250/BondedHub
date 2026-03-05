import { useForm } from "react-hook-form"
import Button from '../components/Button'
import { NavLink } from 'react-router-dom'
import { Eye, EyeOff, Loader } from 'lucide-react'
import z from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useAuthStore } from '../store/useAuthStore'
import toast from "react-hot-toast"
import { useRef } from "react"
import { useState } from "react"

const signUpSchema = z.object({
    name: z.string().trim(),
    email: z.email("Enter valid email"),
    password: z.string().min(8, "Password must contain min 8 characters").max(13)
})

const SignUpPage = () => {
    const [seePassword, setSeePassword] = useState(false);
    const {signUp, loading} = useAuthStore();
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(signUpSchema)
    });

    const onSignUp = async (data) => {
        const res = await signUp(data);
        console.log(res)
    }

    return (
        <div className='bg-[#F8FAFC] flex justify-center items-center h-screen'>
            <div className='bg-white flex flex-col h-127 w-xl px-5 py-5'>
                <div className='flex justify-center h-[20%]'>
                    <h1 className='text-[24px]'>
                        Create Your Account
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSignUp)} className='w-full flex flex-col gap-2 h-[80%]'>
                    <label className='flex flex-col h-17'>
                        <span className='text-[14px]'>
                            Full Name
                        </span>

                        <input 
                            type="text" 
                            className='border-2 h-10 px-2' 
                            name="fullname" 
                            id="fullName" 
                            placeholder='full name' 
                            {...register("name")} 
                        />
                    </label>

                    <label className='flex flex-col h-17'>
                        <span className='text-[14px]'>
                            Email
                        </span>

                        <input 
                            type="email" 
                            {...register("email")} 
                            className='border-2 h-10 px-2' 
                            name="email" 
                            id="email" 
                            placeholder='you@email.com' 
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                    </label>

                    <label className='flex flex-col h-17'>
                        <span className='text-[14px]'>
                            Password
                        </span>

                        <div className='w-full flex items-center justify-between border-2 pr-2'>
                            <input 
                                type={seePassword ? "text" : "password"} 
                                {...register("password")} 
                                className='border-0 h-10 px-2 w-[95%] outline-0' 
                                name="password" 
                                id="password" 
                                placeholder='password' 
                            />

                            {seePassword ? 
                                (<EyeOff className='w-5 cursor-pointer' onClick={() => setSeePassword(!seePassword)} />) 
                                : 
                                (<Eye className='w-5 cursor-pointer' onClick={() => setSeePassword(!seePassword)} />)
                            }
                        </div>
                    </label>

                    <div className='flex flex-col mt-6'>
                        <Button name={loading ? (<Loader className="w-4 animate-spin" />) : ('Sign Up')} bgColor="#2A6E8C" btnSize="16px" type='submit' />

                        <p className='text-[16px]'>
                            Already have an account? 
                            <NavLink to={'/signin'} className='text-[#FF7A59]'> sign in</NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage
