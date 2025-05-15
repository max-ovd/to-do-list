import { ReactSortable } from 'react-sortablejs';



const ItemList = ({ items, editingTaskId, editedText, inputElement, handlers }) => {
    const { startEditing, setItems, setEditedText, saveEdit, toggleItem, cancelEdit, deleteItem } = handlers;

    return (
        <div className="item-list">
            <ReactSortable
                tag="div"
                list={ items }
                setList={ setItems }
                animation={ 150 }
                >
                {items.map((item, index) => (
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
                                { item.item.length > 35 ? item.item.slice(0, 35) + "..." : item.item }
                            </span>
                    )}
                    <input type="image" src="/trashIcon.png" alt="delete" style={{ width: "20px", height: "20px"}} onClick={() => deleteItem(item._id)} />
                    </div>
                ))}
            </ReactSortable>
        </div>
    );
};
export default ItemList;