import './App.css';
import { useContext } from 'react';
import { AppContext } from './contexts/index.ts';
import Base from '@layout/base/index.tsx';

const App = () => {
  const context = useContext(AppContext);

  return (
    <div className="App">
      <AppContext.Provider value={context}>
        <Base />
      </AppContext.Provider>
    </div>
  );
};

export default App;
