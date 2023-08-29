import React, { useEffect } from 'react'

import useAuth from "./useAuth"

import {axiosPrivate} from '../api/axios'
import useRefreshToken from './useRefreshToken'



const useAxiosPrivate = () => {

    const {auth}=useAuth()
    const refresh=useRefreshToken()


    useEffect(()=>{


        const requestInterceptor=axiosPrivate.interceptors.request.use(config=>{
           if(!config.headers['Authorization']){
                config.headers['Authorization']=`Bearer ${auth.accessToken}`;
           }
           return config
        },(error)=>Promise.reject(error))



        const responseInterceptor=axiosPrivate.interceptors.response.use(
            response=>response,

            async (error)=>{
                const prevRequest=error?.config
                console.log(error?.config)

                if (error?.response?.status === 403 && !prevRequest?.sent){

                    prevRequest.sent=true;
                    const newAccessToken=await refresh()

                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);


                }

                return Promise.reject(error)

            }
        )

        return ()=>{
            axiosPrivate.interceptors.request.eject(requestInterceptor)
            axiosPrivate.interceptors.response.eject(responseInterceptor)
        }

    },[auth,refresh])



    return axiosPrivate;
}

export default useAxiosPrivate