import { useState, useEffect } from 'react'


export const useDebounce = (searchText, delay) => {
    const [debounced, setDebounced] = useState(searchText)

    useEffect(() => {
        let searchTimeout = setTimeout(() => {
            setDebounced(searchText)
        }, delay)

        return () => {
            clearTimeout(searchTimeout)
        }
    }, [searchText, delay])

    return debounced
}
