const ItemList = ({ items, editingTaskId, editedText, inputElement, handlers }) => {
    const { startEditing, setEditedText, saveEdit, toggleItem, cancelEdit, deleteItem } = handlers;
    return (
        <div className="item-list">
            {items.map((item) => (
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
                            />
                        )
                        : (
                            <span onDoubleClick={ () => startEditing(item._id) }>
                                { item.item }
                            </span>
                    )}
                    <input type="image" src="/trashIcon.png" alt="delete" style={{ width: "20px", height: "20px"}} onClick={() => deleteItem(item._id)} />
                </div>
            ))}
        </div>
    );
};
export default ItemList;