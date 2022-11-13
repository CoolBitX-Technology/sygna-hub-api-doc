import _ from 'lodash';

export const toSnakeCase = (obj: object): object => {
  return _.mapKeys(obj, (v, k) => _.snakeCase(k));
};
