import _ from 'lodash';

export const toSnakeCase = (obj: object): object => {
  const obj2 = _.cloneDeep(obj);
  if (Array.isArray(obj2)) {
    return obj2.map(v => toSnakeCase(v));
  } else if (obj2 != null && obj2.constructor === Object) {
    return Object.keys(obj2).reduce(
      (result, key) => ({
        ...result,
        [_.snakeCase(key)]: toSnakeCase(obj2[key]),
      }),
      {},
    );
  }
  return obj2;
};
