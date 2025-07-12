import { useEffect, useState, useRef } from "react";
import ItemList from "./ItemList";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import api from '../lib/axiosClient.js';
import Dropdown from './Dropdown.js';

const Home = () => {
    const [item, setItem] = useState('');
    const [isSorted, setSorted] = useState(false);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [lastDeletedItem, setLastDeletedItem] = useState(null);
    const inputElement = useRef(null);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const [fetchedUser, setFetchedUser] = useState();
    const [allListTitles, setAllListTitles] = useState([]);
    const [selectedListTitle, setSelectedListTitle] = useState('');
    const [currentListItems, setCurrentListItems] = useState([]);


    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate])


    const fetchItems = async () => {
        try {
            console.log("client: fetching items");
            const res = await api.get('/items');
            const userInformation = res.data.user;
            setFetchedUser(userInformation);

            if (userInformation && userInformation.lists && userInformation.lists.length > 0) {
                const titles = userInformation.lists.map(list => list.title);
                setAllListTitles(titles);

                const initialList = titles[0];
                setSelectedListTitle(initialList);

                const initialListObject = userInformation.lists.find(list => list.title === initialList)
                if (initialListObject && initialListObject.items) {
                    setCurrentListItems(initialListObject.items);
                }
            }
        } catch (e) {
            console.log("Error fetching: ", e.message);
        }
    }

    useEffect(() => {
        fetchItems();
    }, [])


    useEffect(() => {
        if (!fetchedUser) {
            return console.warn("fetchedUser is not defined yet");
        }
        const currentItems = fetchedUser.lists.find(list => list.title === selectedListTitle);
        setCurrentListItems(currentItems.items);
    }, [selectedListTitle, fetchedUser])

    useEffect(() => {
        let result = [...currentListItems]; // make a copy of items

        // apply search filter
        result = result.filter(item =>
            item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
        );

        // apply sorting
        result = isSorted
                ? [...result].sort((a, b) => a.checked - b.checked)
                : result  
        
        // setFilteredItems
        setFilteredItems(result);
    }, [currentListItems, searchQuery, isSorted])

    useEffect(() => {
        inputElement.current?.focus();
    }, [editingTaskId])

    const startEditing = (id) => {
        const editingItem = currentListItems.find(i => i._id === id);
        setEditingTaskId(editingItem._id);
        setEditedText(editingItem.title);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await api.post('/items/add-item', {
                title: item, 
                checked: false,
                parent: selectedListTitle
            });


            const { newItem, newUser, message } = res.data;

            if (res.status !== 201) {
                return console.errror("Server error when adding new item: ", message);
            }


            setCurrentListItems(prev => [...prev, newItem])
            setFetchedUser(newUser);
            setItem('');

        } catch (e) {
            console.log("error adding new task, ", e.message);
        }
    }

    const toggleItem = async (id) => {
        const toggledItem = currentListItems.find(i => i._id === id);

        try {
            setCurrentListItems(prev =>
                prev.map(i =>
                    i._id === id ? { ...i, checked: !i.checked } : i
                )
            )

            const res = await api.patch(`/items/editTask/${id}`, {
                title: toggledItem.title,
                checked: !toggledItem.checked,
                parent: selectedListTitle
            })

            if (res.status !== 200) {
                console.error("Something went wrong when toggling");
                setCurrentListItems(prev =>
                    prev.map(i =>
                        i._id === id ? { ...i, checked: !i.checked } : i
                    )
                )
                return null;
            }

            const { newUser } = res.data;
            setFetchedUser(newUser);

        } catch (e) {
            console.log(e.message);
        }
    }

    const handleClear = async () => {

        if(!window.confirm("Are you sure you want to clear the entire list?")) return;

        const res = await api.delete(`/items/all/${selectedListTitle}`);

        const { newUser } = res.data;

        setFetchedUser(newUser);
        setCurrentListItems([]);
        setItem('');
    }

    const saveEdit = async (id) => {
        const currentItem = currentListItems.find(i => i._id === id);
        try {

            if (editedText.length < 1) {
                window.alert("please enter a title for the task");
                return;
            }

            const res = await api.patch(`/items/editTask/${id}`, {
                title: editedText,
                checked: currentItem.checked,
                parent: selectedListTitle
            })

            if (res.status !== 200) {
                throw new Error('There was an error saving your edit');
            }

            const { updatedItem, newUser} = res.data;
            setCurrentListItems(prev => prev.map(i => (i._id === id ? { ...i, ...updatedItem} : i)))
            setFetchedUser(newUser);
            setEditedText('');
            setEditingTaskId(null);
        } catch (e) {
            console.error(e.message);
        }
    }

    const cancelEdit = () => {
        setEditedText('');
        setEditingTaskId(null);
    }

    const deleteItem = async (itemId) => {
        try {
            setCurrentListItems(prev => prev.filter(item => item._id !== itemId));

            const res = await api.post(`/items/delete/${selectedListTitle}/${itemId}`);

            if (res.status !== 202) {
                console.error("Something went wrong when deleting the item");
                setCurrentListItems(prev => [...prev, lastDeletedItem]);
                lastDeletedItem(null);
                return null;
            }

            const { deletedItem, newUser } = res.data;
            
            setLastDeletedItem(deletedItem);
            setFetchedUser(newUser);
        } catch (e) {
            console.log("Failed to delete item: ", e.message)
        }
    }

    const handleUndoDelete = async () => {
        if (lastDeletedItem === null) return;
        const updatedItems = [...currentListItems, lastDeletedItem];

        try {
            setCurrentListItems(updatedItems)

            const res = await api.post('/items/add-item', {
                _id: lastDeletedItem._id,
                title: lastDeletedItem.title,
                checked: lastDeletedItem.checked,
                parent: selectedListTitle
            })
            
            const { newItem, newUser, message } = res.data;

            if (res.status !== 201) {
                setCurrentListItems(prev => prev.filter(item => item._id !== newItem._id))
                return console.error("Server error while undoing delete: ", message);
            }

            setFetchedUser(newUser);
            setLastDeletedItem(null);

        } catch (e) {
            console.log('Failed to undo message: ', e.message);
        }
    }

    const handleAddList = async () => {
        const newListName = window.prompt("New List Name: ");

        try {
            if (allListTitles.find(listTitle => listTitle === newListName)) {
                return window.alert("That list already exists, please provide an alternate name!");
            }
            
            const res = await api.post('/items/add-list', {
                title: newListName
            })      

            const { newList, newUser } = res.data; 
            
            setFetchedUser(newUser);
            setAllListTitles(prev => [...prev, newList.title])
            
            if (res.status === 200) {
                console.log(res.data.message);
            } else {
                console.error(res.data.message);
            }
        } catch (e) {
            console.error("There was an error adding a list: ", e.message);
        }

    }

    const handleThemeToggle = () => {
        const htmlElement = document.documentElement;
        const localStorageKey = 'myPicoTheme';

        function setTheme(theme) {
            htmlElement.setAttribute('data-theme', theme);

            // Sets theme in local storage so it persists
            localStorage.setItem(localStorageKey, theme);
        }

        function getTheme() {
            return htmlElement.getAttribute('data-theme');
        }

        const savedTheme = localStorage.getItem(localStorageKey);
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Check user OS preferences
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }

        const currentTheme = getTheme();
        if (currentTheme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }


    }

    return (
        <div className="container">
            <div className="grid header-content">
                <div className="col-auto">
                    <Dropdown allListTitles={ allListTitles } selectedListTitle={ selectedListTitle } setSelectedListTitle={ setSelectedListTitle } />
                </div>
                <nav className="col-auto">
                    <ul>
                        <li>
                            <details className="menu dropdown">
                                <summary role="button" className="secondary">Menu</summary>
                                <ul>
                                    <li onClick={ handleClear }>Clear</li>
                                    <li onClick={ handleUndoDelete }>Undo Delete</li>
                                    <li onClick={ handleAddList }>Add New List</li>
                                    <li onClick={ async () => await supabase.auth.signOut()}>Log Out</li>
                                    <li onClick={ handleThemeToggle } id="theme-toggle">Light/Dark Mode</li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="grid sort-checkbox-container">
                <label>Sort by unchecked?</label>
                <input type="checkbox" id="sort-checkbox" checked={ isSorted } onChange={ () => setSorted(prev => !prev) }/>
            </div>
            <input type="search" id="task-search" placeholder="Search tasks..." onChange={(e) => setSearchQuery(e.target.value)} />


            {<ItemList 
                filteredItems={ filteredItems } 
                inputElement={ inputElement }
                editingTaskId={ editingTaskId } 
                editedText={ editedText } 
                handlers={{
                    startEditing,
                    setFilteredItems,
                    setEditedText, 
                    saveEdit,
                    toggleItem,
                    cancelEdit,
                    deleteItem
                }}
            />}

            <form id="add-task-form" onSubmit={ handleSubmit }>
                <input 
                    type="text"
                    placeholder="Add task..."
                    value={item}
                    onChange={(e) => setItem(e.target.value) } 
                    required
                />
                <button type="submit" className="outline">Add</button>
            </form>


        </div>
    );
};
 
export default Home;