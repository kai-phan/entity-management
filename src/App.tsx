import '../src/usage';

import { QueryClientProvider } from 'react-query';
import TodoList from './test/Todo';
import { QueryAdapter } from './usage';

function App() {
  return (
    <QueryClientProvider client={QueryAdapter.queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}

export default App;
