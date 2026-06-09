import { useState } from "react";

function ArticleForm({ onSubmit }) {

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [body, setBody] = useState("");
    const [refs, setRefs] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const article = {
            title,
            summary,
            body,
            refs: refs
                .split(",")
                .map(r => r.trim())
                .filter(r => r !== "")
        };

        onSubmit(article);
    };

    return (
        <form
            className="form"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <textarea
                placeholder="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
            />

            <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
            />

            <input
                type="text"
                placeholder="Refs separated by commas"
                value={refs}
                onChange={(e) => setRefs(e.target.value)}
            />

            <button type="submit">
                Create Article
            </button>
        </form>
    );
}

export default ArticleForm;