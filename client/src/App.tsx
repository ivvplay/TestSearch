import {ChangeEvent, ReactElement, useEffect, useRef, useState} from "react";
import axios from "axios";
import {DragDropContext, Droppable, Draggable, DropResult, DragStart} from '@hello-pangea/dnd';
import {IResponseData} from "./models/responce/IResponceData.ts";
import {IResponceSortData} from "./models/responce/IResponceSortData.ts";
import './styles/App.css'

function App() {

    const [str, setStr] = useState<IResponseData[]>([])
    const [fetching, setFetching] = useState<boolean>(true)
    const [update, setUpdate] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [search, setSearch] = useState<string>('')
    const totalCountRef = useRef(0);

    useEffect(() => {
        if(fetching){
            axios.get<IResponseData[]>(`http://localhost:3001/api/items?limit=20&page=${currentPage}&q=${search}`)
                .then(res => {
                    setStr(p => [...p, ...res.data])
                    setCurrentPage(p => p + 1)
                    totalCountRef.current = res.data.length*currentPage;
                })
                .finally(() => setFetching(false))
        }
    }, [fetching]);

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    useEffect(() => {
        if(update){
            axios.put<IResponceSortData>('http://localhost:3001/api/items_sort',{str,search})
                .finally(() => setUpdate(false))
        }
    }, [update]);


    const scrollHandler = (e:Event) => {
        if(document.documentElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 100
            && totalCountRef.current < 100) {
            setFetching(true);
        }
    }

    const onSearch = (e:ChangeEvent<HTMLInputElement>) => {
        setStr([])
        setSearch(e.target.value)
        setFetching(true);
        setCurrentPage(1);
    }

    const onCheck= (e:ChangeEvent<HTMLInputElement>, id:string) => {
        setStr(p => p.map(item =>
            item.id === id ?
                {...item, selected: e.target.checked}: item
        ))
        setUpdate(true)
    }

    const handleDragEnd = (result:DropResult) => {
        if (!result.destination) return;
        const newItems: IResponseData[] = [...str];
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);
        setStr(newItems);
        if(search === '') setUpdate(true)
    };

    return (
        <div className="App">
            <div className="wrap-search">
                <input
                    type="text"
                    className="search"
                    placeholder="Поиск"
                    value={search}
                    onChange={onSearch}
                />
            </div>
            <div className="wrap-DDC">
                <DragDropContext
                    onDragEnd={handleDragEnd}
                >
                    <Droppable droppableId='list-1'>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {str.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className='list-item'
                                            >
                                                <input
                                                    disabled={update}
                                                    type="checkbox"
                                                    checked={item.selected}
                                                    onChange={(e) => onCheck(e, item.id)}
                                                />
                                                <span>{item.text}</span>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>
        </div>
    )
}

export default App
