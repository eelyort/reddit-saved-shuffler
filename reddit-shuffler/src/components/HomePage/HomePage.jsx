import React from 'react';
import { Button } from '@mui/material';

const HomePage = (props) => {
    const {
        cookies,
        setCookie,
        removeCookie,
    } = props;

    const stateLength = 11;
    const possibleStateChars = '1234567890abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUV';
    const genRandomString = (x) => {
        return (new Array(x))
            .fill(0)
            .map(
                old => possibleStateChars.charAt(Math.floor(Math.random() * possibleStateChars.length))
            )
            .join('');
    };

    return (
        <div className='homepage-wrapper'>
            <div className='absolute-centering'>
                <Button variant='contained' color='primary' onClick={() => {
                    const localhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                    const clientId = localhost ? 'w2DPtepnkdDDkRNhsmBWGw' : 'qxf3f2sg0iK1roU66vt5zw';
                    const responseType = 'code';
                    const state = genRandomString(stateLength);
                    const redirectUri = localhost ? 'http://localhost:3000/authorize_callback' : 'https://eelyort.github.io/reddit-saved-shuffler/authorize_callback';
                    const duration = 'temporary';
                    const scope = 'history identity modposts save account'

                    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}`
                        + `&response_type=${responseType}&state=${state}`
                        + `&redirect_uri=${redirectUri}&duration=${duration}`
                        + `&scope=${scope}`;
                    console.log(`state: ${state}`);

                    setCookie('loginState', state, { maxAge: 600 });
                    window.location.href = authUrl;
                }}>
                    Log In
                </Button>
            </div>
        </div>
    );
};

export default HomePage;