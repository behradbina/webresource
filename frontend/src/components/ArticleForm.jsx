import { useState } from "react";

function ArticleForm({ onSubmit, initialData = {} }) {
    const [title, setTitle] = useState(initialData.title || "");
    const [summary, setSummary] = useState(initialData.summary || "");
    const [body, setBody] = useState(initialData.body || "");
    // Storing refs as a comma-separated string for simplicity in the UI
    const [refs, setRefs] = useState(initialData.refs ? initialData.refs.join(", ") : "");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert comma-separated string back to an array
        const refsArray = refs
            .split(",")
            .map(ref => ref.trim())
            .filter(ref => ref.length > 0);

        onSubmit({
            title,
            summary,
            body,
            refs: refsArray
        });
    };

    return (
        <div className="form-container">
            <h2>{initialData.title ? "Edit Article" : "Create New Article"}</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="summary">Summary</label>
                    <input
                        id="summary"
                        type="text"
                        className="form-input"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Brief summary of the article"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="body">Content Body</label>
                    <textarea
                        id="body"
                        className="form-input"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your article content here..."
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="refs">References (comma-separated)</label>
                    <input
                        id="refs"
                        type="text"
                        className="form-input"
                        value={refs}
                        onChange={(e) => setRefs(e.target.value)}
                        placeholder="e.g. React Docs, Vite Guide"
                    />
                </div>

                <button type="submit" className="btn-primary">
                    {initialData.title ? "Update Article" : "Publish Article"}
                </button>
            </form>
        </div>
    );
}

export default ArticleForm;