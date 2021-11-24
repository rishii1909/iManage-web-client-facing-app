import React, { useState, useEffect } from 'react';

import {useRouter} from "next/router";
import { getAccessToken } from "../helpers/auth"


const AuthWrapper = ({children}) => {
    const router = useRouter();  
    const [token, setToken] = useState(null);

    useEffect(() => {

        if(!getAccessToken()){
            router.push('/auth/login')
        }

        
    }, []);
    return (
        <div>
            {children}
        </div>
    )
}


export default AuthWrapper