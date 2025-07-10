import { ReactSortable } from 'react-sortablejs';


const ItemList = ({ filteredItems, editingTaskId, editedText, inputElement, handlers }) => {
    const { startEditing, setFilteredItems, setEditedText, saveEdit, toggleItem, cancelEdit, deleteItem } = handlers;
    return (
        <ReactSortable
            tag="div"
            list={ filteredItems }
            setList={ setFilteredItems }
            animation={ 150 }
            >
            {filteredItems.map(item => (
                <div className="item-row" key={item._id}>
                    <label>
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
                                { item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title }
                            </span>
                    )}
                    </label>
                    <img src="/x-button.png" id="delete-task-button" alt="delete" onClick={() => deleteItem(item._id)} />
                </div>
            ))}
        </ReactSortable>
    );
};
export default ItemList;