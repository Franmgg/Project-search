import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/ProjectorSearch.module.css';

function Main() {
    const [listOfProjects, setListOfProjects] = useState([]);
    const [searchText, setSearchText] = useState('');

    function handleSearch(e) {
        setSearchText(e.target.value);
    }

    async function fetchGithubRepos() {
        const response = await axios.get(
            'https://api.github.com/users/Franmgg/repos'
        );
        return response.data;
    }

    async function fetchTopics(repo) {
        const response = await axios.get(
            `https://api.github.com/repos/Franmgg/${repo}/topics`,
            {
                headers: {
                    Accept: "application/vnd.github.mercy-preview+json"
                }
            }
        );
        return response.data;
    }

    function redirectToRepo(link) { // redirigir a la página del repositorio
        window.open(link, '_blank');
    }

    useEffect(() => {
        async function getRepos() {
            const repos = await fetchGithubRepos();
            const returnArray = repos
                .filter(repo => repo.name !== 'Franmgg')
                .filter(repo => repo.name !== 'Project-search')
                .map(async repo => {
                    const topics = await fetchTopics(repo.name);
                    return {
                        Name: repo.name,
                        Description: repo.description || 'No hay descripción',
                        RepoLink: repo.html_url, // agregar el enlace al repositorio
                        Topics: topics.names // agregar los topics
                    };
                });
            setListOfProjects(await Promise.all(returnArray));
        }

        getRepos();
    }, []);

    return (
        <div>
            <div className={styles['SearchingBar']}>
                <h1 className={styles['title']}>Welcome to my projects</h1>
                <input
                    type='text'
                    className='text'
                    placeholder='Search for project'
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>
            <div className={styles['ContainerProject']} onClick={() => redirectToRepo(listOfProjects[0].RepoLink)}>
                {listOfProjects
                    .filter(e => e.Name.toLowerCase().includes(searchText.toLowerCase()))
                    .map(e => (
                        <div className={styles['card']} key={e.Name}>
                            <div className={styles['card-title']}>{e.Name}</div>
                            <div className={styles['card-body']}>{e.Description}</div>
                            <div className={styles['card-footer']}>
                                {e.Topics.map((topic, i) => (
                                    <span key={i} className={styles['topic']}>{topic}</span>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            <div className={styles['infoUser']}>
                <div className={styles['user-info']}>
                    <a href="https://github.com/tu-usuario" target="_blank">
                        <img className={styles['avatar']} src="https://avatars.githubusercontent.com/u/95165729?v=4" alt="Avatar de tu usuario en Github" />
                    </a>
                    <a className={styles['username']} href="https://github.com/Franmgg" target="_blank">Franmgg</a>
                </div>
            </div>
        </div>

    );
}

export default Main;
