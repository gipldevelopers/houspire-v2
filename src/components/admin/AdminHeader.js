// src/components/admin/AdminHeader.js
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Menu,
  Search,
  Sun,
  Moon,
  LogOut,
  Settings,
  User,
  X,
  Loader2,
  Building,
  FolderOpen,
  Users,
  FileText,
  Image,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import searchApi from "@/services/search.service";
import authService from "@/services/auth.service";

// Debounce hook for search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search result item component
const SearchResultItem = ({ item, onSelect, onClose }) => {
  const getIcon = (type) => {
    const icons = {
      user: Users,
      project: FolderOpen,
      vendor: Building,
      render: Image,
      boq: FileText,
      payment: CreditCard,
    };
    const IconComponent = icons[type] || Search;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      user: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      project:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      vendor:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      render:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      boq: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      payment:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const handleClick = () => {
    onSelect(item);
    onClose();
  };

  return (
    <div
      className="flex items-center space-x-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
        {getIcon(item.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {item.title}
          </p>
          <Badge
            variant="outline"
            className={`text-xs ${getTypeColor(item.type)}`}
          >
            {item.type}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
          {item.description}
        </p>
        {item.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// Search suggestions component
const SearchSuggestions = ({ suggestions, onSelect, onClose }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.type}-${suggestion.id}-${index}`}
          className="flex items-center space-x-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0"
          onClick={() => {
            onSelect(suggestion);
            onClose();
          }}
        >
          <Search className="h-4 w-4 text-slate-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {suggestion.text}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {suggestion.type} • {suggestion.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function AdminHeader({ onMenuClick }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const [user, setUser] = useState(null);

  // Use debounce for search queries
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser.data.admin);
    };

    fetchCurrentUser();
  }, []);
  // Handle global search - FIXED DATA ACCESS
  const handleSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchApi.globalSearch({
        query: query,
        limit: 5,
      });

      // Correct data access - response.data contains the actual data
      if (response.data && response.data.data) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search suggestions
  const handleSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const response = await searchApi.getSuggestions({
        query: query,
      });
      // Access suggestions correctly from response
      setSearchSuggestions(response.data?.data?.suggestions || []);
    } catch (error) {
      console.error("Suggestions error:", error);
      setSearchSuggestions([]);
    }
  }, []);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      handleSearch(debouncedSearchQuery);
      handleSuggestions(debouncedSearchQuery);
    } else {
      setSearchResults(null);
      setSearchSuggestions([]);
    }
  }, [debouncedSearchQuery, handleSearch, handleSuggestions]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setShowSearchResults(true);
    } else {
      setSearchSuggestions([]);
      setSearchResults(null);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      handleSearch(searchQuery);
      setShowSearchResults(true);
    }
  };

  const handleResultSelect = (item) => {
    // Navigate to the appropriate page based on item type
    const routes = {
      user: `/admin/users/${item.id}`,
      project: `/admin/projects/${item.id}`,
      vendor: `/admin/vendors/${item.id}`,
      render: `/admin/renders/${item.id}`,
      boq: `/admin/boqs/${item.id}`,
      payment: `/admin/payments/${item.id}`,
    };

    const route = routes[item.type];
    if (route) {
      router.push(route);
    }
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchSuggestions([]);
    setShowSearchResults(false);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
        setSearchSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    logout();
    router.push("/auth/signin");
  };

  // FIXED: Correct results combination
  const allResults = searchResults?.results
    ? [
        ...(searchResults.results.users || []),
        ...(searchResults.results.projects || []),
        ...(searchResults.results.vendors || []),
        ...(searchResults.results.renders || []),
        ...(searchResults.results.boqs || []),
        ...(searchResults.results.payments || []),
      ]
    : [];
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950/95">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2.5 lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-md" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9 pr-9 bg-slate-50 border-slate-200 focus-visible:bg-white dark:bg-slate-900 dark:border-slate-700 dark:focus-visible:bg-slate-950"
                placeholder="Search projects, users, vendors..."
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchQuery.length >= 2 && setShowSearchResults(true)
                }
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* Show loading indicator */}
              {isSearching && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                </div>
              )}

              {/* Search Suggestions */}
              {searchSuggestions.length > 0 && !showSearchResults && (
                <SearchSuggestions
                  suggestions={searchSuggestions}
                  onSelect={handleSuggestionSelect}
                  onClose={() => setSearchSuggestions([])}
                />
              )}

              {/* Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {isSearching
                          ? "Searching..."
                          : `Search Results (${allResults.length})`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-6 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {searchResults?.summary && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(searchResults.summary).map(
                          ([type, count]) =>
                            count > 0 && (
                              <Badge
                                key={type}
                                variant="outline"
                                className="text-xs"
                              >
                                {type}: {count}
                              </Badge>
                            )
                        )}
                      </div>
                    )}
                  </div>

                  {isSearching ? (
                    <div className="flex items-center justify-center p-6">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                      <span className="ml-2 text-sm text-slate-600">
                        Searching...
                      </span>
                    </div>
                  ) : allResults.length > 0 ? (
                    <div className="p-2">
                      {allResults.map((item, index) => (
                        <SearchResultItem
                          key={`${item.type}-${item.id}-${index}`}
                          item={item}
                          onSelect={handleResultSelect}
                          onClose={() => setShowSearchResults(false)}
                        />
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enter at least 2 characters to search
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Separator */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700"
          aria-hidden="true"
        />

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-red-500 text-white text-sm">
                  {user?.name
                    ?.split(" ")
                    .map((w) => w?.[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-slate-200 dark:border-slate-700"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs leading-none text-slate-500 dark:text-slate-400">
                  {user?.email || "admin@houspire.com"}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-1 w-fit bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs"
                >
                  {user?.role || "ADMIN"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

            <DropdownMenuItem
              className="hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              onClick={() => router.push("/admin/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Admin Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuItem
              className="text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
