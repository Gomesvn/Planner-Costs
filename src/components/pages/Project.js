import axios from 'axios'
import { v4 as uuidv4} from 'uuid'
import { useParams } from 'react-router-dom'
import styles from './Project.module.css'
import { useEffect, useState } from 'react'
import { Loading } from '../layout/Loading';
import { Container } from '../layout/Container';
import  ProjectForm  from '../projects/ProjectForm'
import { Message } from '../layout/Message';
import { ServiceForm } from '../service/ServiceForm';
import { ServiceCard } from '../service/ServiceCard'

export function Project(){
    const { id } = useParams() //hook do RRD para pegar o id que vem da url da request do bd
    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(()=>{
        setTimeout(()=> {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'aplication/json', 
                },
            })
            .then( resp => resp.json())
            .then( data => {
                setProject(data)
                setServices(data.services)
            })
            .catch((err) => console.log(err))
        }, 1500);
    }, [id])

    function editPost(project){
        //por naquela outra parte do code onde dava um erro 
        setMessage('');
        //budget validation
        if(project.budget < project.costs){
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        /* fiz com axios pq com fetch não cosegui
        fetch(`http://localhost:5000/projects/${project.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'aplication/json', 
                },
                body: JSON.stringify(project),
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            //mensagem de sucesso 
        })
        .catch(err => console.log(err))
    */
        axios.patch(`http://localhost:5000/projects/${project.id}`, project)
        .then((resp) => {
            setProject(resp.data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!')
            setType('sucess')
        })
        .catch(err => console.log(err))
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }
    
    function toggleServiceForm(){
        setServiceForm(!showServiceForm)
    }

    function createService(project){
        //last service 
        const lastService = project.services[project.services.length - 1] //seleciona o projeo atual
        lastService.id = uuidv4(); //id único para renderizar as listas 

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.costs) + parseFloat(lastServiceCost)

        //maximum value validation 
        if(newCost > parseFloat(project.budget)){
            setMessage('Orçamento ultrapassado, verifique o custo do serviço!')
            setType('error')
            project.services.pop()
            return false
        }

        //add service cost top project cost
        project.costs = newCost;

        //update project 
        axios.patch(`http://localhost:5000/projects/${project.id}`, project)
        .then((resp) => {
            //exibir lista de srviços
            console.log(resp.data.services)
            setServiceForm(false)
        })
        .catch(err => console.log(err))
    }   

    function removeService(id, cost){
        setMessage('');
        //estratégia para diminuir as interações com o bd 
        //atualização do front-end 
        const servicesUpdated = project.services.filter(
            service => service.id !== id
        )

        const projectUpdated = project

        //atualização do backend
        projectUpdated.services = servicesUpdated
        projectUpdated.costs = parseFloat(projectUpdated.costs) - parseFloat(cost)

        axios.patch(`http://localhost:5000/projects/${projectUpdated.id}`, projectUpdated)
        .then((resp) => {   
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
            setType('sucess')
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            {project.name ? (
               <div className={styles.project_details}>
                    <Container customClass="colum">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Category: </span>{project.category.name}
                                    </p>
                                    <p>
                                        <span>Orçamento total: </span>R$ {project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado: </span>R$ {project.costs}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm 
                                        handleSubmit={editPost}
                                        btnText="Concluir edição"
                                        projectData={project}
                                    />
                                </div>

                            )}
                        </div>
                        <div className={styles.service_form_container}>
                                <h2>Adicione um serviço: </h2>
                                <button className={styles.btn} onClick={toggleServiceForm}>
                                    {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                                </button>
                                <div className={styles.project_info}>
                                    {showServiceForm && (
                                        <ServiceForm
                                            handleSubmit={createService}
                                            btnText="Adicionar serviço"
                                            projectData={project}
                                        />
                                    )}
                                    
                                </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                           {services.length > 0  &&
                            services.map((service) => (
                                <ServiceCard
                                    id={service.id}
                                    name={service.name}
                                    cost={service.cost}
                                    description={service.description}
                                    key={service.id}
                                    handleRemove={removeService}
                                
                                />
                            ))
                           }    
                           {services.length === 0  &&
                                <p>Não há serviços.</p>
                           }
                        </Container>
                    </Container>
               </div>
            ) : (
                <Container customClass="colum">
                    <Loading />
                </Container>
            )}
        </>
    )
}