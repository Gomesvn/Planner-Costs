import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Home } from './components/pages/Home';
import { Company } from './components/pages/Company';
import { Contact } from './components/pages/Contact';
import { NewProject } from './components/pages/NewProject';


import { Container } from './components/layout/Container';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Projects } from './components/pages/Projects';
import { Project } from './components/pages/Project';

function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Container customClass='min_height'>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/company' element={<Company />}/>
            <Route path='/contact' element={<Contact />}/>
            <Route path='/newproject' element={<NewProject /> }/>
            <Route path='/projects' element={<Projects />}/>
            <Route path='/projects/:id' element={<Project />}/>
        </Routes>
        </Container>
        <Footer />
        </BrowserRouter>
  );
}

export default App;
