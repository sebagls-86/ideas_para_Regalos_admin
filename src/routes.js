import React from "react";

import { Icon } from "@chakra-ui/react";
import { MdHome, MdForum} from "react-icons/md";
import { BiSolidCategory, BiUserCircle } from "react-icons/bi";
import { TbCalendarStats } from "react-icons/tb";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { FaUser, FaPencilAlt, FaBullhorn, FaCalendarAlt,FaListOl, FaUserFriends, FaShoppingBag, FaIdBadge } from "react-icons/fa";
import { IoMdList } from "react-icons/io";
import { AiOutlineTag, AiOutlineUnorderedList } from "react-icons/ai";


// Admin Imports
import Login from "views/auth/signIn";
import MainDashboard from "views/admin/default";
import Users from "views/admin/users";
import AgeRange from "views/admin/ageRange";
import Categories from "views/admin/categories";
import Events from "views/admin/events";
import EventTypes from "views/admin/eventTypes";
import Forums from "views/admin/forums";
import ForumsMessages from "views/admin/forumsMessages";
import ScheduledEvents from "views/admin/scheduledEvents";
import Profiles from "views/admin/profiles";
import Lists from "views/admin/lists";
import ListTypes from "views/admin/listTypes";
import Relationships from "views/admin/relationships";
import Interests from "views/admin/interests";
import ProductsCatalog from "views/admin/productsCatalog";
import ListProducts from "views/admin/listProducts";
import Profile from "views/admin/profile";
import Forgot from "views/auth/forgot";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={FaUser} width='20px' height='20px' color='inherit' />,
    component: Users,
  },
  {
    name: "Age Range",
    layout: "/admin",
    path: "/age-range",
    icon: <Icon as={TbCalendarStats} width='20px' height='20px' color='inherit' />,
    component: AgeRange,
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "/categories",
    icon: <Icon as={BiSolidCategory} width='20px' height='20px' color='inherit' />,
    component: Categories,
  },
  {
    name: "Events",
    layout: "/admin",
    path: "/events",
    icon: <Icon as={BsFillCalendarEventFill} width='20px' height='20px' color='inherit' />,
    component: Events,
  },
  {
    name: "Events Type",
    layout: "/admin",
    path: "/event-types",
    icon: <Icon as={FaPencilAlt} width='20px' height='20px' color='inherit' />,
    component: EventTypes,
  },
  {
    name: "Scheduled Events",
    layout: "/admin",
    path: "/scheduled-events",
    icon: <Icon as={FaCalendarAlt} width='20px' height='20px' color='inherit' />,
    component: ScheduledEvents,
  },
  {
    name: "Forums",
    layout: "/admin",
    path: "/forums",
    icon: <Icon as={FaBullhorn} width='20px' height='20px' color='inherit' />,
    component: Forums,
  },
  {
    name: "Forums Messages",
    layout: "/admin",
    path: "/messages",
    icon: <Icon as={MdForum} width='20px' height='20px' color='inherit' />,
    component: ForumsMessages,
  },
  {
    name: "Profiles",
    layout: "/admin",
    path: "/profiles",
    icon: <Icon as={BiUserCircle} width='20px' height='20px' color='inherit' />,
    component: Profiles,
  },
  {
    name: "Lists",
    layout: "/admin",
    path: "/lists",
    icon: <Icon as={IoMdList} width='20px' height='20px' color='inherit' />,
    component: Lists,
  },
  {
    name: "List Products",
    layout: "/admin",
    path: "/list-products",
    icon: <Icon as={AiOutlineUnorderedList} width='20px' height='20px' color='inherit' />,
    component: ListProducts,
  },
  {
    name: "List Types",
    layout: "/admin",
    path: "/list-types",
    icon: <Icon as={FaListOl} width='20px' height='20px' color='inherit' />,
    component: ListTypes,
  },
  {
    name: "Relationships",
    layout: "/admin",
    path: "/relationships",
    icon: <Icon as={FaUserFriends} width='20px' height='20px' color='inherit' />,
    component: Relationships,
  },
  {
    name: "Products Catalog",
    layout: "/admin",
    path: "/products-catalog",
    icon: <Icon as={FaShoppingBag} width='20px' height='20px' color='inherit' />,
    component: ProductsCatalog,
  },
  {
    name: "Interests",
    layout: "/admin",
    path: "/interests",
    icon: <Icon as={AiOutlineTag} width='20px' height='20px' color='inherit' />,
    component: Interests,
  },
 
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={FaIdBadge} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Login",
    layout: "/auth",
    path: "/sign-in",
    component: Login,
    hidden: true,
  },
  {
    name: "Forgot",
    layout: "/auth",
    path: "/forgot-password",
    component: Forgot,
    hidden: true,
  },
 ];

export default routes;
