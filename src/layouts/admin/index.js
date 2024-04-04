// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes.js';
import { useAuth0 } from "@auth0/auth0-react";
import configJson from "../../auth_config.json";
import { useHistory } from "react-router-dom";

// Custom Chakra theme
export default function Dashboard(props) {
    const { ...rest } = props;
    // states and functions
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [tokenExists, setTokenExists] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
	const history = useHistory();
	const { getAccessTokenWithPopup } = useAuth0();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        const fetchTokenAndVerifyUser = async () => {
            try {
                if (storedToken === undefined || storedToken === null) {
                    const newAccessToken = await getAccessTokenWithPopup({
                        authorizationParams: {
                            audience: configJson.audience,
                            scope: "read:current_user",
                        },
                    });

                    console.log("access token", newAccessToken)

                    setAccessToken(newAccessToken);
                    localStorage.setItem("token", newAccessToken);
                    await verifyUser(newAccessToken);
                    setTokenExists(true);
                }
            } catch (error) {
                console.error("Error during login or registration:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (!storedToken && !tokenExists) {
            fetchTokenAndVerifyUser();
        } else {
            setAccessToken(storedToken);
            setTokenExists(true);
            setIsLoading(false);
        }
    }, [tokenExists, getAccessTokenWithPopup]);

   
        const verifyUser = async (token) => {
            try {
                const verifyResponse = await fetch(
                    `http://localhost:8080/api/v1/users/verify`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!verifyResponse.ok) {
                    throw new Error("Failed to verify user");
                }

                const verifyData = await verifyResponse.json();
                console.log("verifyData", verifyData);

				if (verifyData.data.user_role <=0 && verifyData.data.user_role <= 4) {
				localStorage.removeItem("token");
				localStorage.removeItem("userInfo");
				history.replace("/auth/login");
				}
                localStorage.setItem("userInfo", JSON.stringify(verifyData));
            } catch (error) {
                console.error("Error verifying user:", error.message);
            }
        };


    const getRoute = () => {
        return window.location.pathname !== '/admin/full-screen-maps';
    };

    const getActiveRoute = (routes) => {
        let activeRoute = 'Default Brand Text';
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i].items);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].items);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };

    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbar(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                    return routes[i].secondary;
                }
            }
        }
        return activeNavbar;
    };

    const getActiveNavbarText = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                    return routes[i].messageNavbar;
                }
            }
        }
        return activeNavbar;
    };

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === '/admin') {
                return <Route path={prop.layout + prop.path} component={prop.component} key={key} />;
            }
            if (prop.collapse) {
                return getRoutes(prop.items);
            }
            if (prop.category) {
                return getRoutes(prop.items);
            } else {
                return null;
            }
        });
    };

    document.documentElement.dir = 'ltr';
    const { onOpen } = useDisclosure();
    document.documentElement.dir = 'ltr';

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        <Box>
            <Box>
                <SidebarContext.Provider
                    value={{
                        toggleSidebar,
                        setToggleSidebar
                    }}>
                    <Sidebar routes={routes} display='none' {...rest} />
                    <Box
                        float='right'
                        minHeight='100vh'
                        height='100%'
                        overflow='auto'
                        position='relative'
                        maxHeight='100%'
                        w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                        maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                        transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
                        transitionDuration='.2s, .2s, .35s'
                        transitionProperty='top, bottom, width'
                        transitionTimingFunction='linear, linear, ease'>
                        <Portal>
                            <Box>
                                <Navbar
                                    onOpen={onOpen}
                                    logoText={'Horizon UI Dashboard PRO'}
                                    brandText={getActiveRoute(routes)}
                                    secondary={getActiveNavbar(routes)}
                                    message={getActiveNavbarText(routes)}
                                    fixed={fixed}
                                    {...rest}
                                />
                            </Box>
                        </Portal>

                        {getRoute() ? (
                            <Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
                                <Switch>
                                    {getRoutes(routes)}
                                    <Redirect from='/' to='/admin/default' />
                                </Switch>
                            </Box>
                        ) : null}
                        <Box>
                            
                        </Box>
                    </Box>
                </SidebarContext.Provider>
            </Box>
        </Box>
    );
}
