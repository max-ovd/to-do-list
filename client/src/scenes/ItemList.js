import { ReactSortable } from 'react-sortablejs';


const ItemList = ({ filteredItems, editingTaskId, editedText, inputElement, handlers }) => {
    const { startEditing, setFilteredItems, setEditedText, saveEdit, toggleItem, cancelEdit, deleteItem } = handlers;
    return (
        <div className="item-list">

            <ReactSortable
                tag="div"
                list={ filteredItems }
                setList={ setFilteredItems }
                animation={ 150 }
                >
                {filteredItems.map(item => (
                    <div className="item-content" key={ item._id }>
                        <input 
                            type="checkbox" 
                            checked={ item.checked } 
                            onChange={ () => toggleItem(item._id) }
                        />
                        { editingTaskId === item._id ? (
                            <input
                                type="text" 
                                value={ editedText } 
                                ref={ inputElement }
                                onChange={ (e) => setEditedText(e.target.value) }
                                onKeyDown={ (e) => {
                                    if (e.key === 'Enter') {
                                        saveEdit(item._id);
                                    }
                                    else if (e.key === 'Escape') {
                                        cancelEdit();
                                    }
                                }}
                                onBlur={ cancelEdit }
                            />
                        )
                        : (
                            <span onDoubleClick={ () => startEditing(item._id) }>
                                { item.title.length > 35 ? item.title.slice(0, 35) + "..." : item.title }
                            </span>
                    )}
                    <input type="image" src="/trashIcon.png" alt="delete" style={{ width: "17px", height: "17px"}} onClick={() => deleteItem(item._id)} />
                    </div>
                ))}
            </ReactSortable>
        </div>
    );
};
export default ItemList;