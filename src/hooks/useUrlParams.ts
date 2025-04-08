import * as React from 'react';

export const useUrlParams = () => {
    const [urlParams, setUrlParams] = React.useState<URLSearchParams>(
        new URLSearchParams(window.location.search)
    );

    React.useEffect(() => {
        const handleUrlChange = () => {
            setUrlParams(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handleUrlChange);
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
        };
    }, []);

    const updateUrlParam = (key: string, value: string) => {
        const newParams: URLSearchParams = new URLSearchParams(urlParams.toString());
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }

        const newUrl = `${window.location.pathname}?${newParams.toString()}`;
        window.history.pushState({}, '', newUrl);
        setUrlParams(newParams);
    };

    return { urlParams, updateUrlParam };
};