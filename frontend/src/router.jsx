import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import CreateArticlePage from "./pages/CreateArticlePage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "articles/:title",
                element: <ArticlePage />
            },
            {
                path: "create",
                element: <CreateArticlePage />
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundPage />
    }
]);

export default router;