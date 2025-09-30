import App from './app/index';

const warn = console.warn;

console.warn = params => {
  if (params.includes('Non-serializable values')) {
    return;
  }
  return warn;
};

export default App;
