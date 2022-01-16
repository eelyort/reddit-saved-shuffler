import React from 'react';
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import { qs } from 'url-parse';

const AuthCallback = (props) => {
    const {
        cookies,
        setCookie,
        removeCookie,
    } = props;
    const navigate = useNavigate();

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const state = searchParams.get('state');
        const code = searchParams.get('code');
        console.log(`state: ${state}, code: ${code}`);
        const localhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const clientId = localhost ? 'w2DPtepnkdDDkRNhsmBWGw' : 'qxf3f2sg0iK1roU66vt5zw';
        const clientSecret = localhost ? 'ZmiZJP7WyOurnLRMA64Px67uS8OteQ' : 'bM1V0c-X63jfhxoVl9ttRsi7r-Vj4Q';
        const redirectUri = localhost ? 'http://localhost:3000/authorize_callback' : 'https://eelyort.github.io/reddit-saved-shuffler/authorize_callback';

        if (state === cookies.loginState) {
            // we now need to turn the one-time-use code into an auth token
            fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                },
                // the body needs to be in x-www-form-urlencoded format
                body: qs.stringify({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri,
                }),
            })
                .then(res => {
                    // console.log('access token 1');
                    // console.log(res);
                    return res.json();
                })
                .then(data => {
                    // console.log('access token 2');
                    // console.log(data);
                    const userToken = data.access_token;
                    // while we're at it, fetch the username as well
                    fetch(`https://oauth.reddit.com/api/v1/me`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    })
                        .then(response => {
                            // console.log("username 1");
                            // console.log(response);
                            return response.json();
                        })
                        .then(data => {
                            // console.log("username 2");
                            // console.log(data);
                            const username = data.name;
                            setCookie('username', username, { maxAge: '3400' });
                            setCookie('userToken', userToken, { maxAge: '3400' });
                        });
                });
                // TODO: build in excepts
        }
    }, []);

    return (
        <div className='absolute-centering'>
            <CircularProgress color={'primary'} />
        </div>
    );
};

export default AuthCallback;