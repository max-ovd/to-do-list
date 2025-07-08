import { useState } from "react";


const Dropdown = ({ allListTitles, selectedListTitle, setSelectedListTitle }) => {
    
    const [trigger, setTrigger] = useState(false);

    const handleNewListSelection = (item) => {
        setTrigger(!trigger);
        setSelectedListTitle(item);
    }

    return (
        <div className="dropdown">
            <button className="dropbtn" onClick={() => {setTrigger(!trigger)}}>
                { selectedListTitle }
            </button>


               {trigger && 
               allListTitles.filter(item => item !== selectedListTitle)
               .map((item, index) => (
                    <div key={index} className="dropdown-content">
                        <button onClick={() => handleNewListSelection(item)}>
                            { item }
                        </button>
                    </div>
                ))}
        </div>
    )
}


export default Dropdown;