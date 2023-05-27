import '../src/usage';

import { QueryClient, QueryClientProvider } from 'react-query';
import TodoList from './test/Todo';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

export default App;
