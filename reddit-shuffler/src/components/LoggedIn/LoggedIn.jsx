import React from 'react';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { qs } from 'url-parse';

// ratelimit: 60/min
const LoggedIn = (props) => {
    const {
        cookies,
        setCookie,
        removeCookie,
    } = props;

    // fetch: we can only fetch in batches of 100 so this might take a bit
    const [isFetching, setIsFetching] = React.useState(false);
    const [fetchAfter, setFetchAfter] = React.useState('');
    const [fetchesPending, setFetchesPending] = React.useState(0);
    const [saved, setSaved] = React.useState([]);

    // fetch: we can only fetch in batches of 100 so this might take a bit
    const fetchSaved = (username, userToken, after) => {
        fetch(`https://oauth.reddit.com/user/${username}/saved/?limit=100${after ? `&after=${after}` : ''}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("1");
                console.log(response);
                console.log(response.headers);
                return response.json();
            })
            .then(json => {
                const data = json.data;
                console.log("2");
                console.log(data);
                setFetchAfter(data.after ? data.after : '')
                setFetchesPending(old => old-1);
                setSaved(old => [...old, ...data.children]);
            });
    };
    React.useEffect(() => {
        if (isFetching) {
            // first fetch
            if (fetchesPending === -1) {
                setSaved([]);
                setFetchesPending(1);
                setTimeout(() => fetchSaved(cookies.username, cookies.userToken, ''), 1025);
            }
            // next fetch
            else if (fetchesPending === 0 && fetchAfter) {
                setFetchesPending(old => old+1);
                setTimeout(() => fetchSaved(cookies.username, cookies.userToken, fetchAfter), 1025);
            }
            // weird update, ignore
            else if (fetchesPending === 1) {
                // TODO: make sure there is an except that sets state so that this doesn't cause infinite loading
            }
            // finished
            else {
                setIsFetching(false);
            }
        }
    }, [isFetching, fetchAfter, fetchesPending]);
    console.log(`SAVED`);
    console.log(saved);

    const [shuffledList, setShuffledList] = React.useState([]);
    // Again, we need to be careful about the rate limit
    const [shuffledIndex, setShuffledIndex] = React.useState(-1);
    const [shuffleConfirmation, setShuffleConfirmation] = React.useState(false);
    const fetchUnsaveSave = (postId, userToken) => {
        fetch(`https://oauth.reddit.com/api/unsave?id=${postId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            // the body needs to be in x-www-form-urlencoded format
        })
            .then(response => {
                console.log("unsave 1");
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log("unsave 2");
                console.log(data);
                // save
                fetch(`https://oauth.reddit.com/api/save?id=${postId}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                    // the body needs to be in x-www-form-urlencoded format
                })
                    .then(response => {
                        console.log("save 1");
                        console.log(response);
                        return response.json();
                    })
                    .then(data => {
                        console.log("save 2");
                        console.log(data);
                        // TODO save
                    });
            });
    };
    React.useEffect(() => {
        // start
        if (shuffledIndex === 0) {
            // shuffle - Fisher-Yates algorithm (put everything in a hat, pull them out one by one)
            let newList = [...saved];
            for(let i = 0; i < newList.length-1; i++) {
                const remainingElements = newList.length - i;
                const pickedElement = Math.floor(Math.random() * remainingElements) + i;
                let a = newList[i];
                newList[i] = newList[pickedElement];
                newList[pickedElement] = a;
            }
            newList = newList.map(x => `${x.kind}_${x.data.id}`);
            setShuffledList(newList);
            // do the first unsave/save
            setTimeout(() => {
                fetchUnsaveSave(newList[0], cookies.userToken);
                setShuffledIndex(old => old+1);
            }, 2050);
        }
        // next
        else if (shuffledIndex >= 1 && shuffledIndex < shuffledList.length) {
            setTimeout(() => {
                fetchUnsaveSave(shuffledList[shuffledIndex], cookies.userToken);
                setShuffledIndex(old => old+1);
            }, 2050);
        }
        // finished
        else {
            setShuffledIndex(-1);
            setShuffleConfirmation(true);
        }
    }, [shuffledIndex]);

    const isBusy = isFetching || shuffledIndex !== -1;

    return (
        <div className='loggedin-wrapper'>
            <div className='absolute-centering'>
                <div className='loggedin-inner-wrapper'>
                    <div className='loggedin-container'>
                        <div className='flex-grow' />
                        <h1>Welcome {cookies.username}!</h1>
                        <div className='flex-grow' />
                    </div>
                    <div className='loggedin-container'>
                        <div className='flex-grow' />
                        <Button disabled={isBusy} variant='contained' color='primary' onClick={() => {
                            setIsFetching(true);
                            setFetchAfter('');
                            setFetchesPending(-1);
                            // fetchSaved(cookies.username, cookies.userToken);
                        }}>
                            Get Saved
                        </Button>
                        <Button variant='contained' color='secondary' onClick={() => {
                            removeCookie('userToken');
                        }}>
                            Log Out
                        </Button>
                        <div className='flex-grow' />
                    </div>
                    {(isBusy) ? (
                        <div className='loggedin-container'>
                            <div className='flex-grow' />
                            <CircularProgress color='primary' />
                            <div className='flex-grow' />
                        </div>
                    ) : null}
                    <div className='loggedin-container'>
                        <div className='flex-grow' />
                        <h3>Found {saved.length} saved posts.</h3>
                        <div className='flex-grow' />
                    </div>
                    <div className='loggedin-container'>
                        <div className='flex-grow' />
                        <Button disabled={isBusy || saved.length === 0} variant='contained' color='primary' onClick={() => {
                            setShuffleConfirmation(false);
                            setShuffledIndex(0);
                        }}>
                            Shuffle Saved
                        </Button>
                        <div className='flex-grow' />
                    </div>
                    {(shuffleConfirmation) ? (
                        <div className='loggedin-container'>
                            <div className='flex-grow' />
                            <h3>Shuffled!</h3>
                            <div className='flex-grow' />
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default LoggedIn;