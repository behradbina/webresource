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
        fetchArticles();
    }, [search, sort]);

    const fetchArticles = async () => {
        try {
            const response = await getArticles(search, sort);
            setArticles(response.data);
        }
        catch (error) {
            toast.error("Failed to load articles");
        }
    };

    const citationCounts = {};

    articles.forEach(article => {
        article.refs?.forEach(ref => {
            citationCounts[ref] = (citationCounts[ref] || 0) + 1;
        });
    });

    return (
        <div>

            <SearchBar
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
            />

            <div className="grid">
                {
                    articles.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            citationCount={citationCounts[article.title] || 0}
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default HomePage;