import { Link } from "react-router-dom";

function ArticleCard({ article, citationCount }) {

    return (
        <div className="article-card">

            <h2>{article.title}</h2>

            <p>{article.summary}</p>

            <p>
                <strong>Cited by:</strong> {citationCount}
            </p>

            <p>
                <strong>Published:</strong>{" "}
                {new Date(article.publishTime).toLocaleDateString()}
            </p>

            <Link to={`/articles/${article.title}`}>
                Read More
            </Link>

        </div>
    );
}

export default ArticleCard;