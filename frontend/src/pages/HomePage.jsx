import { useEffect, useState } from "react";
import { getArticles } from "../api/articleApi";
import ArticleCard from "../components/ArticleCard";
import SearchBar from "../components/SearchBar";
import { toast } from "react-toastify";

function HomePage() {
    const [articles, setArticles] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("refs");

    useEffect(() => {
        const controller = new AbortController();
        let toastShown = false;

        const fetchArticles = async () => {
            try {
                const response = await getArticles(search, sort, { signal: controller.signal });
                setArticles(response.data);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
                if (toastShown) return;
                toastShown = true;

                let msg = "Failed to load articles";
                if (error.code === "ERR_NETWORK") {
                    msg = "Backend is unreachable. Is Spring Boot running on :8080?";
                } else if (error.response) {
                    msg = `Server error ${error.response.status}: ${error.response.data || "Check backend logs"}`;
                }
                toast.error(msg);
            }
        };

        fetchArticles();
        return () => controller.abort();
    }, [search, sort]);

    const citationCounts = {};
    articles.forEach((article) => {
        article.refs?.forEach((ref) => {
            citationCounts[ref] = (citationCounts[ref] || 0) + 1;
        });
    });

    return (
        <div>
            <SearchBar search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
            <div className="grid">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        citationCount={citationCounts[article.title] || 0}
                    />
                ))}
            </div>
        </div>
    );
}

export default HomePage;