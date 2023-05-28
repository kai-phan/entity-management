import React from 'react';
import { Entity } from '../../usage';

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
  const { data } = Todo.useQueryOne({ variables: 1 });

  console.log(data);

  return <React.Fragment></React.Fragment>;
};

export default TodoList;
