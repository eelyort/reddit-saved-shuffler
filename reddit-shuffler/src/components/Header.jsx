import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, IconButton, Button, Typography, Toolbar, AppBar, MenuItem, Alert } from '@mui/material';

const Header = () => {
    return (
        <>
            <AppBar key={"appBar"} position="static" color="primary" style={{maxHeight: "125px", paddingTop: "1%", color: "white"}}>
                <Toolbar key={"toolBar"}>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
