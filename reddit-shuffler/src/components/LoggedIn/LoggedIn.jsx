import React from 'react';
import { Button } from '@mui/material';
// const snoowrap = require('snoowrap');

const LoggedIn = (props) => {
    const {
        cookies,
        setCookie,
        removeCookie,
    } = props;

    return (
        <div className='loggedin-wrapper'>
            <div className='absolute-centering'>
                <Button variant='contained' color='primary' onClick={() => {
                    // const r = new snoowrap();
                    // console.log(r);
                    console.log(cookies.userToken);
                    fetch(`https://oauth.reddit.com/api/v1/me`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${cookies.userToken}`,
                        },
                    })
                        .then(response => {
                            console.log("1");
                            console.log(response);
                            return response.text();
                        })
                        .then(data => {
                            console.log("2");
                            console.log(data);
                        });
                }}>
                    Go
                </Button>
                <Button variant='contained' color='secondary' onClick={() => {
                    removeCookie('userToken');
                }}>
                    Log Out
                </Button>
            </div>
        </div>
    );
};

export default LoggedIn;