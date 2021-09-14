import React,{useState,useEffect} from 'react'
import {Button} from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import KanbanCard from '../kanbanCard/KanbanCard';
import './Create-board.css';
import DropWrapper from '../wrapper/DropWrapper';

const CreateBoard = ({isOver,children}) => {
    const className = isOver ? " highlight-region" : "";
    const [header,setHeader] = useState('');
    const [isEditItem,setIsEdititem] = useState(null);
    const [items,setItems] = useState([]);
    const [editMode,setEditMode]=useState(false)
    const [userToken,setUserToken] = useState();
    const history = useHistory()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setUserToken(token)
    if (token === null) {
      history.push("/")
    }
    loadBoardsFromLocalStorage();
  }, [])

  const handleChange = (e) => {
    setHeader(e.target.value)
  }

  const setEdit = (id) => {
    let editItem = items.find((ele) => {
      return ele.id === id
    })
    setEditMode(!editMode)
    setHeader(editItem.header)
    setIsEdititem(id)
  }


  const handleClick = () => {
    if (!header) {
      alert('input is empty')
    } else if (header && editMode) {
      let updatedList = items.map((ele) => {
        if (ele.id === isEditItem) {
          return { ...ele, header: header }
        }
        return ele
      })
      setItems(updatedList)
      saveBoardsToLocalStorage(updatedList)
      setEditMode(!editMode)
      setHeader("")
      setIsEdititem(null)
    } else {
      const allInputData = { id: new Date().getTime().toString(), header: header,tokenId: userToken}
      let newBoardList = [...items, allInputData]
      setItems(newBoardList)
      saveBoardsToLocalStorage(newBoardList)
      setHeader("")
    }
  }

  const handleDelete = (id) => {
    const updatedItems = items.filter((ele) => {
      return ele.id !== id;
    })
    setItems(updatedItems)
    saveBoardsToLocalStorage(updatedItems)
  }

  const logout = () => {
    localStorage.removeItem('token');
    history.push("/")
  }


  const saveBoardsToLocalStorage = (boards) => {
    localStorage.setItem('boards', JSON.stringify(boards))
  }

  const loadBoardsFromLocalStorage = () => {
    let loadedBoards = localStorage.getItem('boards')
    const token = localStorage.getItem('token')
    let boards = JSON.parse(loadedBoards)
    console.log(boards, "in load")
    if (boards) {
      let tokenId = boards.map(item => item.tokenId)
      if (tokenId[0] == token) {
        setItems(boards)
      } else {
        setItems([])
      }
    }
  }


    return(
        <div className="kanban-board">
          <div className="header">
            <div>
              <h1>KANBAN BOARD</h1>
            </div>
            <div className="mt-20">
              <Button className="logout-btn" onClick={logout}>
                Log Out
              </Button>
            </div>
          </div>
          <div className="mb-20">
            <input type="text" name="header" className="input-box" value={header} onChange={handleChange} />
            {editMode ?
              <Button className="board-btn" onClick={handleClick}>SaveBoard</Button> :
              <Button className="board-btn" onClick={handleClick}>CreateBoard</Button>
            }
          </div>
          <main>
            <section className="d-flex">
              {items.map((e, index) => {
                return (
                  <KanbanCard
                    item={e}
                    key={index}
                    boards={items}
                    status={e.header}
                    setEdit={setEdit}
                    handleDelete={handleDelete}
                    index={index}
                  />
                )
              })}
            </section>
          </main>
        </div>
    )
};

export default CreateBoard;
