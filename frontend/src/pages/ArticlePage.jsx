// frontend/src/pages/ArticlePage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    getArticle,
    deleteArticle,
    getReferrers
} from "../api/articleApi";

import { toast } from "react-toastify";

function ArticlePage() {
    const { title } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get current user

    const [article, setArticle] = useState(null);
    const [referrers, setReferrers] = useState([]);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        fetchArticle();
        fetchReferrers();
    }, [title]);

    const fetchArticle = async () => {
        try {
            const response = await getArticle(title);
            setArticle(response.data);
            // Check if current user is the author
            if (user && response.data.authorUsername === user.username) {
                setIsAuthor(true);
            } else {
                setIsAuthor(false);
            }
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
        if (!user) {
            toast.error("Please login to delete articles");
            return;
        }

        if (!isAuthor) {
            toast.error("You can only delete your own articles");
            return;
        }

        if (window.confirm("Are you sure you want to delete this article?")) {
            try {
                await deleteArticle(title);
                toast.success("Article deleted successfully");
                navigate("/");
            }
            catch (error) {
                if (error.response?.status === 403) {
                    toast.error("You don't have permission to delete this article");
                } else if (error.response?.status === 401) {
                    toast.error("Please login to delete articles");
                } else {
                    toast.error("Delete failed");
                }
            }
        }
    };

    if (!article) {
        return <h2>Loading...</h2>;
    }

    return (
        <div>
            <h1>{article.title}</h1>

            {/* Show author info */}
            <p style={{ color: "var(--text)", fontSize: "0.9rem" }}>
                By: {article.authorUsername}
            </p>

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

            {/* Only show delete button if user is the author */}
            {isAuthor && user && (
                <button
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    Delete Article
                </button>
            )}
        </div>
    );
}

export default ArticlePage;