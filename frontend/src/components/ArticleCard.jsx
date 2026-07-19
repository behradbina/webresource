import { Link } from "react-router-dom";

function ArticleCard({ article, citationCount }) {
    return (
        <div className="article-card">
            <h2>{article.title}</h2>
            
            <p className="summary">{article.summary}</p>
            
            <div className="card-footer" style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start",
                gap: "8px"
            }}>
                <span className="badge">
                    Cited by: {citationCount || 0}
                </span>
                
                <span>
                    {new Date(article.publishTime).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </span>
                
                <Link to={`/articles/${article.title}`}>
                    Read More &rarr;
                </Link>
            </div>
        </div>
    );
}

export default ArticleCard;