import ora from 'ora';

let spinner; // shared between start and stop

export const start = (par) => {
    spinner = ora(par || 'Loading...').start();
};

export const stop = (par) => {
    if (spinner) {
        spinner.succeed(par || '');
    } else {
        console.warn('loader is not running');
    }
};