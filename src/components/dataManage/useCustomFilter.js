import { useState, useEffect } from "react";

// Custom hook for filtering
const useCustomFilter = (initialData, customFilter) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    const applyCustomFilter = (item) => {
      // Use the provided custom filter function
      return customFilter(item, searchTerm);
    };

    if (searchTerm) {
      const filteredResult = initialData.filter((item) => applyCustomFilter(item));
      setFilteredData(filteredResult);
    } else {
      setFilteredData(initialData);
    }
  }, [searchTerm, initialData]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return { searchTerm, handleSearch, filteredData };
};

export default useCustomFilter;
