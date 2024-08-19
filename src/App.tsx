import './App.css';
import { useContext } from 'react';
import Components from '@components/index.tsx';
import { AppContext } from './contexts/index.ts';

const App = () => {
  const context = useContext(AppContext);

  return (
    <div className="App">
      <AppContext.Provider value={context}>
        <Components />
      </AppContext.Provider>
    </div>
  );
};

export default App;
