import React from 'react';
import { Entity } from '../../usage';
import { useSelection } from '../../ultil/Selection.ts';

export type Props = {
  className?: string;
};

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export class Todo extends Entity {
  static endpoint = 'todos' as const;
}

const TodoList: React.FC<Props> = () => {
  const { data = [] } = Todo.useQueryList({ variables: { userId: 1 } });
  const { selectedKeys, selection } = useSelection(data, (t) => t.id, [1, 3]);

  return (
    <React.Fragment>
      <div>{JSON.stringify(selectedKeys)}</div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {data.map((todo) => (
          <div key={todo.id} onClick={() => selection.toggleItem(todo)}>
            {todo.title} - {todo.id}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default TodoList;
