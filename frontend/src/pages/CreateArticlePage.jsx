import { useNavigate } from "react-router-dom";

import { createArticle } from "../api/articleApi";
import ArticleForm from "../components/ArticleForm";

import { toast } from "react-toastify";

function CreateArticlePage() {

    const navigate = useNavigate();

    const handleCreate = async (article) => {

        try {
            await createArticle(article);

            toast.success("Article created successfully");

            navigate("/");
        }
        catch (error) {

            if (error.response) {
                toast.error(error.response.data);
            }
            else {
                toast.error("Failed to create article");
            }
        }
    };

    return (
        <div>
            <h1>Create Article</h1>

            <ArticleForm onSubmit={handleCreate} />
        </div>
    );
}

export default CreateArticlePage;
