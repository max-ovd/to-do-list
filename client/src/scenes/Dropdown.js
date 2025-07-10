import { useRef } from "react";


const Dropdown = ({ allListTitles, selectedListTitle, setSelectedListTitle }) => {
    
    const dropdownRef = useRef(null);


    const handleNewListSelection = (item) => {
        setSelectedListTitle(item);
        dropdownRef.current.open = false;
    }

    return (
        <>
            <details className="dropdown" ref={ dropdownRef }>
                <summary role="button" className="secondary">
                    { selectedListTitle }
                </summary>
                <ul>
                {allListTitles.filter(item => item !== selectedListTitle)
                .map((item, index) => (
                        <li key={ index } onClick={() => handleNewListSelection(item)}>
                            { item }
                        </li>
                    ))}
                </ul>
            </details>
        </>
    )
}


export default Dropdown;