import { ADD, DELETE } from '../constants/todos'

export const add = (data) => {
  return {
    data,
    type: ADD
  }
}

export const del = (data) => {
  return {
    data,
    type: DELETE
  }
}