import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    getArticle,
    deleteArticle,
    getReferrers
} from "../api/articleApi";

import { toast } from "react-toastify";

function ArticlePage() {

    const { title } = useParams();

    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [referrers, setReferrers] = useState([]);

    useEffect(() => {
        fetchArticle();
        fetchReferrers();
    }, [title]);

    const fetchArticle = async () => {
        try {
            const response = await getArticle(title);
            setArticle(response.data);
        }
        catch (error) {
            toast.error("Article not found");
            navigate("/");
        }
    };

    const fetchReferrers = async () => {
        try {
            const response = await getReferrers(title);
            setReferrers(response.data);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteArticle(title);
            toast.success("Article deleted");
            navigate("/");
        }
        catch (error) {
            toast.error("Delete failed");
        }
    };

    if (!article) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>

            <h1>{article.title}</h1>

            <p>{article.summary}</p>

            <div className="body">
                {article.body}
            </div>

            <h3>References</h3>

            <ul>
                {
                    article.refs.map(ref => (
                        <li key={ref}>
                            <Link to={`/articles/${ref}`}>
                                {ref}
                            </Link>
                        </li>
                    ))
                }
            </ul>

            <h3>Referral Points</h3>

            <ul>
                {
                    referrers.map(ref => (
                        <li key={ref.title}>
                            <Link to={`/articles/${ref.title}`}>
                                {ref.title}
                            </Link>
                        </li>
                    ))
                }
            </ul>

            <button
                className="delete-btn"
                onClick={handleDelete}
            >
                Delete Article
            </button>
        </div>
    );
}

export default ArticlePage;
