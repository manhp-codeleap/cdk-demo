import './App.css';
import { ItemList } from './components/ItemList';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient()


function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <ItemList/>
      </div>
    </QueryClientProvider>
  );
}

export default App;
