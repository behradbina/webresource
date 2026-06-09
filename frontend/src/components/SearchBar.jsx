function SearchBar({
    search,
    setSearch,
    sort,
    setSort
}) {

    return (
        <div className="search-bar">

            <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
            >
                <option value="refs">Sort by References</option>
                <option value="date">Sort by Date</option>
            </select>
        </div>
    );
}

export default SearchBar;