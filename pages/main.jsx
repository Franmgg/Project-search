import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ProjectorSearch.module.css';
function Main() {
    const [listOfProjects, setListOfProjects] = useState([]);
    const [searchText, setSearchText] = useState('');

    function handleSearch(e) {
        setSearchText(e.target.value);
    }

    var ArrayText = {
        "projecto": [
            { Name: "Projecto1", Description: "Easy" },
            { Name: "Projecto2", Description: "Medium" },
            { Name: "Projecto3", Description: "Hard" }
        ]
    }

    async function fetchGithubRepos() {
        const response = await axios.get(
            'https://api.github.com/users/Franmgg/repos'
        );
        return response.data;
    }

    const filter = (e) => {
        let returnArray = [];
        const nameProjects = ArrayText['projecto'].map(x => x.Name.toLowerCase());

        if (e) {
            nameProjects.forEach((name, i) => {
                if (name.includes(e.toLowerCase())) {
                    returnArray.push(ArrayText['projecto'][i]);
                }
            });
        } else {
            returnArray = ArrayText['projecto'];
        }

        setListOfProjects(returnArray);
    };

    useEffect(() => {
        setListOfProjects(ArrayText['projecto']);

        async function getRepos() {
            const repos = await fetchGithubRepos();            
            const returnArray = repos
            .filter(repo => repo.name !== 'Franmgg')
            .map(repo => ({
                Name: repo.name,
                Description: repo.description || 'No hay descripción'
            }));
            setListOfProjects(returnArray);
        }

        getRepos();
    }, [])

    useEffect(() => {
    }, [listOfProjects])
    return (
        <div>
            <div className={styles['SearchingBar']}>
                <h1 className={styles['title']}>Bienvenidos a mis proyectos</h1>
                <input
                    type='text'
                    className='text'
                    placeholder='Escribe el proyecto a buscar'
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>
            <div className={styles['ContainerProject']}>
                {listOfProjects
                    .filter(e => e.Name.toLowerCase().includes(searchText.toLowerCase()))
                    .map(e => (
                        <div className={styles['card']} key={e.Name}>
                            <div className={styles['card-title']}>{e.Name}</div>
                            <div className={styles['card-body']}>{e.Description}</div>
                        </div>
                    ))}
            </div>
        </div>

    );
}

export default Main;