import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AccountManagement from "./pages/AccountManagement";
import NewsManagement from "./pages/NewsManagement";
import Tag from "./pages/Tag";
import Category from "./pages/Category";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/accounts", element: <AccountManagement /> },
  { path: "/news", element: <NewsManagement /> },
  { path: "/tags", element: <Tag /> },
  { path: "/categories", element: <Category /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
